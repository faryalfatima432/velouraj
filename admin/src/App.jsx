import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

import Dashboard from "./pages/dashboard/Dashboard";

import Products from "./pages/products/Products";
import AddProduct from "./pages/products/AddProduct";
import EditProduct from "./pages/products/EditProduct";
import ProductDetails from "./pages/products/ProductDetails";

import Categories from "./pages/categories/Categories";
import AddCategory from "./pages/categories/AddCategory";
import EditCategory from "./pages/categories/EditCategory";
import Orders from "./pages/orders/Orders";
import OrderDetails from "./pages/orders/OrderDetails";
import Users from "./pages/users/Users";
import Profile from "./pages/profile/Profile";
import ContactMessages from "./pages/messages/ContactMessages";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              index
              element={<Dashboard />}
            />

            {/* Products */}
            <Route
              path="products"
              element={<Products />}
            />

            <Route
              path="products/add"
              element={<AddProduct />}
            />

            <Route
              path="products/:id"
              element={<ProductDetails />}
            />

            <Route
              path="products/edit/:id"
              element={<EditProduct />}
            />

            {/* Categories */}
            <Route
              path="categories"
              element={<Categories />}
            />

            <Route
              path="categories/add"
              element={<AddCategory />}
            />

            <Route
              path="categories/edit/:id"
              element={<EditCategory />}
            />

            {/* Orders */}
            <Route
              path="orders"
              element={<Orders />}
            />

            <Route
              path="orders/:id"
              element={<OrderDetails />}
            />

            <Route
              path="messages"
              element={<ContactMessages />}
            />
            
            {/* Users */}
            <Route
              path="users"
              element={<Users />}
            />

            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/admin"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;