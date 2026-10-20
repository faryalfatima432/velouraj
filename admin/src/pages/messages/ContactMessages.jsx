import { useEffect, useMemo, useState } from "react";
import {
  FiExternalLink,
  FiInbox,
  FiMail,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

import API from "../../services/api";

const statuses = ["New", "In Progress", "Resolved"];

function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/contact");
      setMessages(response.data.contactMessages || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load contact messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return messages.filter((item) => {
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      const searchableText = [
        item.name,
        item.email,
        item.subject,
        item.message,
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!query || searchableText.includes(query));
    });
  }, [messages, search, statusFilter]);

  const updateStatus = async (message, status) => {
    try {
      setUpdatingId(message._id);
      setError("");
      const response = await API.patch(
        `/contact/${message._id}/status`,
        { status }
      );
      setMessages((current) =>
        current.map((item) =>
          item._id === message._id
            ? response.data.contactMessage
            : item
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update message status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const deleteMessage = async (message) => {
    if (!window.confirm(`Delete the message “${message.subject}”?`)) {
      return;
    }

    try {
      setDeletingId(message._id);
      setError("");
      await API.delete(`/contact/${message._id}`);
      setMessages((current) =>
        current.filter((item) => item._id !== message._id)
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to delete this message."
      );
    } finally {
      setDeletingId("");
    }
  };

  const stats = [
    { label: "All messages", value: messages.length },
    { label: "New", value: messages.filter((item) => item.status === "New").length },
    { label: "In progress", value: messages.filter((item) => item.status === "In Progress").length },
    { label: "Resolved", value: messages.filter((item) => item.status === "Resolved").length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review and follow up on messages sent through the customer contact form.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchMessages}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, subject, or message"
              aria-label="Search contact messages"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by message status"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-60 items-center justify-center text-sm text-slate-500">
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
            <FiInbox className="text-3xl text-slate-400" />
            <h2 className="mt-4 font-semibold text-slate-800">
              {messages.length ? "No matching messages" : "No contact messages yet"}
            </h2>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              {messages.length
                ? "Try another search term or status."
                : "Customer messages will appear here when submitted."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-220 w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">From</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Message</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Received</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMessages.map((message) => (
                  <tr key={message._id} className="align-top transition hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{message.name}</p>
                      <a className="mt-1 block text-sm text-blue-700 hover:underline" href={`mailto:${message.email}`}>
                        {message.email}
                      </a>
                    </td>
                    <td className="max-w-md px-5 py-4">
                      <p className="font-semibold text-slate-800">{message.subject}</p>
                      <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm leading-5 text-slate-600">
                        {message.message}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {new Date(message.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={message.status}
                        disabled={updatingId === message._id}
                        onChange={(event) => updateStatus(message, event.target.value)}
                        aria-label={`Status for ${message.subject}`}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:opacity-60"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <a
                          href={`mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                          aria-label={`Reply to ${message.name}`}
                          title="Reply by email"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                        >
                          <FiExternalLink />
                        </a>
                        <button
                          type="button"
                          onClick={() => deleteMessage(message)}
                          disabled={deletingId === message._id}
                          aria-label={`Delete message from ${message.name}`}
                          title="Delete message"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          {deletingId === message._id ? "…" : <FiTrash2 />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="flex items-center gap-2 text-xs text-slate-500">
        <FiMail /> Showing {filteredMessages.length} of {messages.length} messages
      </p>
    </div>
  );
}

export default ContactMessages;
