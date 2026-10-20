// import Order from "../models/Order.js";
// import Product from "../models/Product.js";
// import crypto from "crypto";

// /*
// ==================================================
// CREATE ORDER
// ==================================================
// */

// export const createOrder = async (req, res) => {
//   try {
//     const {
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       paymentDetails,
//     } = req.body;

//     const allowedPaymentMethods = [
//       "Cash on Delivery",
//       "Bank Transfer",
//       "JazzCash",
//       "Easypaisa",
//       "Card Payment",
//     ];

//     if (!allowedPaymentMethods.includes(paymentMethod)) {
//       return res.status(400).json({
//         success: false,
//         message: "Please select a valid payment method.",
//       });
//     }

//     const isOnlinePayment = paymentMethod !== "Cash on Delivery";

//     if (
//       isOnlinePayment &&
//       paymentMethod !== "Card Payment" &&
//       !paymentDetails?.transactionId?.trim()
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment transaction ID is required for online payment.",
//       });
//     }

//     if (paymentMethod === "Card Payment") {
//       const cardNumber = paymentDetails?.cardNumber?.replace(/\s/g, "");
//       const expiry = paymentDetails?.expiry?.trim();
//       const cvv = paymentDetails?.cvv?.trim();

//       if (!/^\d{16}$/.test(cardNumber || "")) {
//         return res.status(400).json({
//           success: false,
//           message: "Enter a valid 16-digit card number.",
//         });
//       }

//       if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry || "")) {
//         return res.status(400).json({
//           success: false,
//           message: "Enter the card expiry in MM/YY format.",
//         });
//       }

//       if (!/^\d{3,4}$/.test(cvv || "")) {
//         return res.status(400).json({
//           success: false,
//           message: "Enter a valid card security code.",
//         });
//       }
//     }

//     /*
//     ----------------------------------------------
//     BASIC VALIDATION
//     ----------------------------------------------
//     */

//     if (!orderItems || orderItems.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Your cart is empty.",
//       });
//     }

//     if (!shippingAddress) {
//       return res.status(400).json({
//         success: false,
//         message: "Shipping address is required.",
//       });
//     }

//     const requiredAddressFields = [
//       "fullName",
//       "phone",
//       "address",
//       "city",
//     ];

//     for (const field of requiredAddressFields) {
//       if (!shippingAddress[field]?.trim()) {
//         return res.status(400).json({
//           success: false,
//           message: `${field} is required.`,
//         });
//       }
//     }

//     /*
//     ----------------------------------------------
//     VERIFY PRODUCTS AND STOCK
//     ----------------------------------------------
//     */

//     const finalOrderItems = [];

//     for (const item of orderItems) {
//       const product = await Product.findById(item.product);

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Product not found: ${item.name}`,
//         });
//       }

//       const quantity = Number(item.quantity);

//       if (!quantity || quantity < 1) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid quantity for ${product.name}.`,
//         });
//       }

//       if (product.stock < quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Only ${product.stock} item(s) available for ${product.name}.`,
//         });
//       }

//       /*
//       --------------------------------------------
//       USE SERVER-SIDE PRICE
//       --------------------------------------------
//       */

//       const price =
//         product.salePrice !== null &&
//         product.salePrice !== undefined &&
//         Number(product.salePrice) > 0
//           ? Number(product.salePrice)
//           : Number(product.price);

//       finalOrderItems.push({
//         product: product._id,
//         name: product.name,
//         image: product.images?.[0] || "",
//         price,
//         quantity,
//       });
//     }

//     /*
//     ----------------------------------------------
//     CALCULATE TOTALS ON SERVER
//     ----------------------------------------------
//     */

//     const itemsPrice = finalOrderItems.reduce(
//       (total, item) => {
//         return total + item.price * item.quantity;
//       },
//       0
//     );

//     /*
//       You can change this later to:
//       - free shipping over Rs. 3000
//       - city based shipping
//       - courier API
//     */

//     const shippingPrice = itemsPrice >= 3000 ? 0 : 200;

//     const totalPrice = itemsPrice + shippingPrice;

//     /*
//     ----------------------------------------------
//     CREATE ORDER
//     ----------------------------------------------
//     */

//     const order = await Order.create({
//       ...(req.user ? { user: req.user._id } : {}),

//       orderItems: finalOrderItems,

//       shippingAddress: {
//         fullName: shippingAddress.fullName.trim(),
//         phone: shippingAddress.phone.trim(),
//         address: shippingAddress.address.trim(),
//         city: shippingAddress.city.trim(),
//         state: shippingAddress.state?.trim() || "",
//         postalCode:
//           shippingAddress.postalCode?.trim() || "",
//         country:
//           shippingAddress.country?.trim() || "Pakistan",
//       },

//       paymentMethod:
//         paymentMethod,

//       paymentDetails: isOnlinePayment
//         ? {
//             transactionId:
//               paymentMethod === "Card Payment"
//                 ? `CARD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
//                 : paymentDetails.transactionId.trim(),
//             senderPhone: paymentDetails.senderPhone?.trim() || "",
//           }
//         : undefined,

//       paymentStatus:
//         paymentMethod === "Card Payment" ? "Paid" : "Pending",

//       itemsPrice: Number(itemsPrice.toFixed(2)),

//       shippingPrice: Number(shippingPrice.toFixed(2)),

//       totalPrice: Number(totalPrice.toFixed(2)),
//     });

//     /*
//     ----------------------------------------------
//     REDUCE STOCK
//     ----------------------------------------------
//     */

//     for (const item of finalOrderItems) {
//       await Product.findByIdAndUpdate(
//         item.product,
//         {
//           $inc: {
//             stock: -item.quantity,
//           },
//         }
//       );
//     }

//     /*
//     ----------------------------------------------
//     RESPONSE
//     ----------------------------------------------
//     */

//     const populatedOrder = await Order.findById(order._id)
//       .populate("user", "name email phone");

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully.",
//       order: populatedOrder,
//     });
//   } catch (error) {
//     console.error("CREATE ORDER ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to create order.",
//     });
//   }
// };

// /*
// ==================================================
// GET MY ORDERS
// ==================================================
// */

// export const getMyOrders = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(200).json({
//         success: true,
//         orders: [],
//       });
//     }

//     const orders = await Order.find({
//       user: req.user._id,
//     }).sort({
//       createdAt: -1,
//     });

//     res.status(200).json({
//       success: true,
//       orders,
//     });
//   } catch (error) {
//     console.error("GET MY ORDERS ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch your orders.",
//     });
//   }
// };

// /*
// ==================================================
// GET SINGLE MY ORDER
// ==================================================
// */

// export const getMyOrderById = async (req, res) => {
//   try {
//     const order = await Order.findOne({
//       _id: req.params.id,
//       user: req.user._id,
//     });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     console.error("GET ORDER ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch order.",
//     });
//   }
// };

// /*
// ==================================================
// ADMIN - GET ALL ORDERS
// ==================================================
// */

// export const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({})
//       .populate("user", "name email phone")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       orders,
//     });
//   } catch (error) {
//     console.error("GET ALL ORDERS ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch orders.",
//     });
//   }
// };

// /*
// ==================================================
// ADMIN - GET ORDER BY ID
// ==================================================
// */

// export const getAdminOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate("user", "name email phone");

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     console.error("GET ADMIN ORDER ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch order.",
//     });
//   }
// };

// /*
// ==================================================
// ADMIN - UPDATE ORDER STATUS
// ==================================================
// */

// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderStatus } = req.body;

//     const allowedStatuses = [
//       "Pending",
//       "Processing",
//       "Shipped",
//       "Delivered",
//       "Cancelled",
//     ];

//     if (!allowedStatuses.includes(orderStatus)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid order status.",
//       });
//     }

//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found.",
//       });
//     }

//     /*
//     ----------------------------------------------
//     PREVENT CHANGING DELIVERED ORDER
//     ----------------------------------------------
//     */

//     if (
//       order.orderStatus === "Delivered" &&
//       orderStatus !== "Delivered"
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "A delivered order cannot be moved to another status.",
//       });
//     }

//     /*
//     ----------------------------------------------
//     CANCEL ORDER
//     ----------------------------------------------
//     */

//     if (orderStatus === "Cancelled") {
//       if (order.orderStatus === "Delivered") {
//         return res.status(400).json({
//           success: false,
//           message:
//             "A delivered order cannot be cancelled.",
//         });
//       }

//       /*
//       Restore stock only when cancelling an order
//       that was not already cancelled.
//       */

//       if (order.orderStatus !== "Cancelled") {
//         for (const item of order.orderItems) {
//           await Product.findByIdAndUpdate(
//             item.product,
//             {
//               $inc: {
//                 stock: item.quantity,
//               },
//             }
//           );
//         }
//       }

//       order.cancelledAt = new Date();
//     }

//     /*
//     ----------------------------------------------
//     DELIVERED
//     ----------------------------------------------
//     */

//     if (orderStatus === "Delivered") {
//       order.isDelivered = true;
//       order.deliveredAt = new Date();
//     } else {
//       order.isDelivered = false;
//       order.deliveredAt = null;
//     }

//     order.orderStatus = orderStatus;

//     await order.save();

//     const updatedOrder = await Order.findById(order._id)
//       .populate("user", "name email phone");

//     res.status(200).json({
//       success: true,
//       message: `Order status updated to ${orderStatus}.`,
//       order: updatedOrder,
//     });
//   } catch (error) {
//     console.error("UPDATE ORDER STATUS ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to update order status.",
//     });
//   }
// };

// /*
// ==================================================
// ADMIN - UPDATE PAYMENT STATUS
// ==================================================
// */

// export const updatePaymentStatus = async (req, res) => {
//   try {
//     const { paymentStatus } = req.body;
//     const allowedStatuses = ["Pending", "Paid", "Failed"];

//     if (!allowedStatuses.includes(paymentStatus)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid payment status.",
//       });
//     }

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { paymentStatus },
//       { new: true, runValidators: true }
//     ).populate("user", "name email phone");

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: `Payment status updated to ${paymentStatus}.`,
//       order,
//     });
//   } catch (error) {
//     console.error("UPDATE PAYMENT STATUS ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to update payment status.",
//     });
//   }
// };

import Order from "../models/Order.js";
import Product from "../models/Product.js";

import {
  generatePaymentOrderId,
  createEasypaisaPayment,
} from "../services/easypaisaService.js";

/*
==================================================
CREATE ORDER - CASH ON DELIVERY
==================================================
*/

export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
    } = req.body;

    /*
    ----------------------------------------------
    COD ONLY
    ----------------------------------------------
    */

    if (paymentMethod !== "Cash on Delivery") {
      return res.status(400).json({
        success: false,
        message:
          "This endpoint is only for Cash on Delivery orders.",
      });
    }

    /*
    ----------------------------------------------
    BASIC VALIDATION
    ----------------------------------------------
    */

    if (
      !orderItems ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required.",
      });
    }

    const requiredAddressFields = [
      "fullName",
      "phone",
      "address",
      "city",
    ];

    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]?.trim()) {
        return res.status(400).json({
          success: false,
          message: `${field} is required.`,
        });
      }
    }

    /*
    ----------------------------------------------
    VERIFY PRODUCTS
    ----------------------------------------------
    */

    const finalOrderItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(
        item.product
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${
            item.name || "Unknown product"
          }`,
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid quantity for ${product.name}.`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message:
            `Only ${product.stock} item(s) available for ${product.name}.`,
        });
      }

      /*
      --------------------------------------------
      SERVER-SIDE PRICE
      --------------------------------------------
      */

      const price =
        product.salePrice !== null &&
        product.salePrice !== undefined &&
        Number(product.salePrice) > 0
          ? Number(product.salePrice)
          : Number(product.price);

      finalOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "",
        price,
        quantity,
      });
    }

    /*
    ----------------------------------------------
    CALCULATE TOTALS
    ----------------------------------------------
    */

    const itemsPrice = finalOrderItems.reduce(
      (total, item) => {
        return total + item.price * item.quantity;
      },
      0
    );

    const shippingPrice =
      itemsPrice >= 3000 ? 0 : 200;

    const totalPrice =
      itemsPrice + shippingPrice;

    /*
    ----------------------------------------------
    CREATE COD ORDER
    ----------------------------------------------
    */

    const order = await Order.create({
      user: req.user?._id,

      orderItems: finalOrderItems,

      shippingAddress: {
        fullName:
          shippingAddress.fullName.trim(),

        phone:
          shippingAddress.phone.trim(),

        address:
          shippingAddress.address.trim(),

        city:
          shippingAddress.city.trim(),

        state:
          shippingAddress.state?.trim() || "",

        postalCode:
          shippingAddress.postalCode?.trim() || "",

        country:
          shippingAddress.country?.trim() ||
          "Pakistan",
      },

      paymentMethod: "Cash on Delivery",

      paymentProvider: "COD",

      paymentStatus: "Pending",

      paymentOrderId: "",

      paymentTransactionId: "",

      paymentPaidAt: null,

      itemsPrice:
        Number(itemsPrice.toFixed(2)),

      shippingPrice:
        Number(shippingPrice.toFixed(2)),

      totalPrice:
        Number(totalPrice.toFixed(2)),

      orderStatus: "Pending",
    });

    /*
    ----------------------------------------------
    REDUCE STOCK
    ----------------------------------------------
    */

    for (const item of finalOrderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    /*
    ----------------------------------------------
    RESPONSE
    ----------------------------------------------
    */

    const populatedOrder =
      await Order.findById(order._id)
        .populate(
          "user",
          "name email phone"
        );

    return res.status(201).json({
      success: true,

      message:
        "Cash on Delivery order placed successfully.",

      order: populatedOrder,
    });
  } catch (error) {
    console.error(
      "CREATE COD ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create Cash on Delivery order.",
    });
  }
};

/*
==================================================
CREATE ONLINE PAYMENT
==================================================
*/

export const createOnlinePayment = async (
  req,
  res
) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
    } = req.body;

    /*
    ----------------------------------------------
    CURRENT ONLINE METHOD
    ----------------------------------------------
    */

    if (paymentMethod !== "Easypaisa") {
      return res.status(400).json({
        success: false,
        message:
          "Only Easypaisa online payment is currently configured.",
      });
    }

    /*
    ----------------------------------------------
    CART VALIDATION
    ----------------------------------------------
    */

    if (
      !orderItems ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    /*
    ----------------------------------------------
    ADDRESS VALIDATION
    ----------------------------------------------
    */

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message:
          "Shipping address is required.",
      });
    }

    const requiredAddressFields = [
      "fullName",
      "phone",
      "address",
      "city",
    ];

    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]?.trim()) {
        return res.status(400).json({
          success: false,
          message: `${field} is required.`,
        });
      }
    }

    /*
    ----------------------------------------------
    VERIFY PRODUCTS AND STOCK
    ----------------------------------------------
    */

    const finalOrderItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(
        item.product
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            `Product not found: ${
              item.name || "Unknown product"
            }`,
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid quantity for ${product.name}.`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message:
            `Only ${product.stock} item(s) available for ${product.name}.`,
        });
      }

      const price =
        product.salePrice !== null &&
        product.salePrice !== undefined &&
        Number(product.salePrice) > 0
          ? Number(product.salePrice)
          : Number(product.price);

      finalOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "",
        price,
        quantity,
      });
    }

    /*
    ----------------------------------------------
    CALCULATE TOTALS
    ----------------------------------------------
    */

    const itemsPrice = finalOrderItems.reduce(
      (total, item) => {
        return total + item.price * item.quantity;
      },
      0
    );

    const shippingPrice =
      itemsPrice >= 3000 ? 0 : 200;

    const totalPrice =
      itemsPrice + shippingPrice;

    /*
    ----------------------------------------------
    GENERATE SHOPHUB PAYMENT ORDER ID
    ----------------------------------------------
    */

    const paymentOrderId =
      generatePaymentOrderId();

    /*
    ----------------------------------------------
    CREATE PENDING ORDER
    ----------------------------------------------
    */

    const order = await Order.create({
      user: req.user?._id,

      orderItems: finalOrderItems,

      shippingAddress: {
        fullName:
          shippingAddress.fullName.trim(),

        phone:
          shippingAddress.phone.trim(),

        address:
          shippingAddress.address.trim(),

        city:
          shippingAddress.city.trim(),

        state:
          shippingAddress.state?.trim() || "",

        postalCode:
          shippingAddress.postalCode?.trim() || "",

        country:
          shippingAddress.country?.trim() ||
          "Pakistan",
      },

      paymentMethod: "Easypaisa",

      paymentProvider: "EASYPAISA",

      paymentStatus: "Pending",

      paymentOrderId,

      paymentTransactionId: "",

      paymentPaidAt: null,

      paymentFailureReason: "",

      itemsPrice:
        Number(itemsPrice.toFixed(2)),

      shippingPrice:
        Number(shippingPrice.toFixed(2)),

      totalPrice:
        Number(totalPrice.toFixed(2)),

      orderStatus: "Pending",
    });

    /*
    ----------------------------------------------
    CREATE EASYPAISA PAYMENT
    ----------------------------------------------
    */

    const payment =
      createEasypaisaPayment({
        orderRefNum: paymentOrderId,

        amount: totalPrice,
      });

    /*
    ----------------------------------------------
    RESPONSE
    ----------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message:
        "Payment session created.",

      orderId: order._id,

      paymentOrderId,

      paymentUrl:
        payment.paymentUrl,

      paymentFields:
        payment.fields,
    });
  } catch (error) {
    console.error(
      "CREATE ONLINE PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create online payment.",
    });
  }
};

/*
==================================================
EASYPAISA CALLBACK
==================================================
*/

export const easypaisaCallback = async (
  req,
  res
) => {
  try {
    console.log(
      "EASYPAISA CALLBACK:",
      req.body
    );

    /*
    ----------------------------------------------
    IMPORTANT
    ----------------------------------------------

    Easypaisa's exact callback response fields
    depend on the merchant integration method
    enabled for your account.

    Do NOT mark the order Paid merely because the
    browser reached this URL.

    The transaction must be verified according to
    your Easypaisa merchant integration guide.
    ----------------------------------------------
    */

    const {
      orderRefNum,
      transactionId,
      paymentStatus,
    } = req.body;

    if (!orderRefNum) {
      return res.status(400).send(
        "Missing order reference."
      );
    }

    const order = await Order.findOne({
      paymentOrderId: orderRefNum,
    });

    if (!order) {
      return res.status(404).send(
        "Order not found."
      );
    }

    /*
    ----------------------------------------------
    PAYMENT SUCCESS
    ----------------------------------------------
    */

    if (
      paymentStatus === "PAID" ||
      paymentStatus === "SUCCESS"
    ) {
      order.paymentStatus = "Paid";

      order.paymentTransactionId =
        transactionId || "";

      order.paymentPaidAt =
        new Date();

      order.paymentFailureReason = "";

      order.orderStatus = "Processing";

      await order.save();

      return res.redirect(
        `${process.env.CLIENT_URL}/payment/success?orderId=${order._id}`
      );
    }

    /*
    ----------------------------------------------
    PAYMENT FAILED
    ----------------------------------------------
    */

    order.paymentStatus = "Failed";

    order.paymentFailureReason =
      "Payment was not completed.";

    await order.save();

    return res.redirect(
      `${process.env.CLIENT_URL}/payment/failed?orderId=${order._id}`
    );
  } catch (error) {
    console.error(
      "EASYPAISA CALLBACK ERROR:",
      error
    );

    return res.status(500).send(
      "Payment callback failed."
    );
  }
};

/*
==================================================
GET MY ORDERS
==================================================
*/

export const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "GET MY ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch your orders.",
    });
  }
};

/*
==================================================
GET SINGLE MY ORDER
==================================================
*/

export const getMyOrderById = async (
  req,
  res
) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "GET MY ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch order.",
    });
  }
};

/*
==================================================
ADMIN - GET ALL ORDERS
==================================================
*/

export const getAllOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find({})
      .populate(
        "user",
        "name email phone"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "GET ALL ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch orders.",
    });
  }
};

/*
==================================================
ADMIN - GET ORDER BY ID
==================================================
*/

export const getAdminOrderById = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findById(
        req.params.id
      ).populate(
        "user",
        "name email phone"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "GET ADMIN ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch order.",
    });
  }
};

/*
==================================================
ADMIN - DELETE ORDER
==================================================
*/

export const deleteOrder = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Pending, processing, and shipped orders still reserve stock.
    if (
      order.orderStatus !== "Cancelled" &&
      order.orderStatus !== "Delivered"
    ) {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await order.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
      orderId: order._id,
    });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete order.",
    });
  }
};

/*
==================================================
CUSTOMER - DELETE OWN ORDER
==================================================
*/

export const deleteMyOrder = async (
  req,
  res
) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (
      order.orderStatus !== "Cancelled" &&
      order.orderStatus !== "Delivered"
    ) {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await order.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
      orderId: order._id,
    });
  } catch (error) {
    console.error("DELETE MY ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete your order.",
    });
  }
};

/*
==================================================
ADMIN - UPDATE ORDER STATUS
==================================================
*/

export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { orderStatus } =
      req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order status.",
      });
    }

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    /*
    ----------------------------------------------
    DELIVERED ORDER CANNOT BE CHANGED
    ----------------------------------------------
    */

    if (
      order.orderStatus ===
        "Delivered" &&
      orderStatus !== "Delivered"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A delivered order cannot be moved to another status.",
      });
    }

    /*
    ----------------------------------------------
    CANCEL ORDER
    ----------------------------------------------
    */

    if (
      orderStatus === "Cancelled" &&
      order.orderStatus !== "Cancelled"
    ) {
      /*
      Restore stock.
      */

      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              stock: item.quantity,
            },
          }
        );
      }

      order.cancelledAt =
        new Date();
    }

    /*
    ----------------------------------------------
    DELIVERED
    ----------------------------------------------
    */

    if (
      orderStatus === "Delivered"
    ) {
      order.isDelivered = true;

      order.deliveredAt =
        new Date();
    } else if (
      orderStatus !== "Cancelled"
    ) {
      order.isDelivered = false;

      order.deliveredAt = null;
    }

    order.orderStatus =
      orderStatus;

    await order.save();

    const updatedOrder =
      await Order.findById(
        order._id
      ).populate(
        "user",
        "name email phone"
      );

    return res.status(200).json({
      success: true,

      message:
        `Order status updated to ${orderStatus}.`,

      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update order status.",
    });
  }
};

/*
==================================================
ADMIN - UPDATE PAYMENT STATUS
==================================================
*/

export const updatePaymentStatus = async (
  req,
  res
) => {
  try {
    const { paymentStatus } =
      req.body;

    const allowedStatuses = [
      "Pending",
      "Paid",
      "Failed",
    ];

    if (
      !allowedStatuses.includes(
        paymentStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment status.",
      });
    }

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.paymentStatus =
      paymentStatus;

    if (
      paymentStatus === "Paid"
    ) {
      order.paymentPaidAt =
        order.paymentPaidAt ||
        new Date();

      order.paymentFailureReason =
        "";

      if (
        order.orderStatus ===
        "Pending"
      ) {
        order.orderStatus =
          "Processing";
      }
    }

    if (
      paymentStatus === "Failed"
    ) {
      order.paymentFailureReason =
        "Payment marked as failed by administrator.";
    }

    await order.save();

    const updatedOrder =
      await Order.findById(
        order._id
      ).populate(
        "user",
        "name email phone"
      );

    return res.status(200).json({
      success: true,

      message:
        `Payment status updated to ${paymentStatus}.`,

      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "UPDATE PAYMENT STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update payment status.",
    });
  }
};