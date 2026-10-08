import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ===============================
// PLACE ORDER
// ===============================
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });

        await newOrder.save();

        // Clear user's cart
        await userModel.findByIdAndUpdate(req.body.userId, {
            cartData: {},
        });

        // Create Stripe line items
        const line_item = req.body.items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100 * 80),
            },
            quantity: item.quantity,
        }));

        // Delivery charge
        line_item.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: 2 * 100 * 80,
            },
            quantity: 1,
        });

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: line_item,
            mode: "payment",

            // IMPORTANT: success, NOT sucess
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,

            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({
            success: true,
            session_url: session.url,
        });
    } catch (error) {
        console.log("Place Order Error:", error);

        res.json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// VERIFY ORDER
// ===============================
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (!orderId) {
            return res.json({
                success: false,
                message: "Order ID is missing",
            });
        }

        if (success === "true") {
            // Payment successful
            await orderModel.findByIdAndUpdate(orderId, {
                payment: true,
            });

            return res.json({
                success: true,
                message: "Payment Successful",
            });
        } else {
            // Payment failed/cancelled
            await orderModel.findByIdAndDelete(orderId);

            return res.json({
                success: false,
                message: "Payment Failed",
            });
        }
    } catch (error) {
        console.log("Verify Order Error:", error);

        res.json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// GET USER ORDERS
// ===============================
const userOrders = async (req, res) => {
    try {
        const userId = req.body.userId;

        if (!userId) {
            return res.json({
                success: false,
                message: "User ID is missing",
            });
        }

        const orders = await orderModel.find({
            userId: userId,
        });

        res.json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.log("User Orders Error:", error);

        res.json({
            success: false,
            message: error.message,
        });
    }
};
///Listing order for admin pannel
const listOrders = async (req, res) => {
    try {
        const order = await orderModel.find({});
        res.json({success:true,data:order})
    } catch (error) {
        console.log("error");
        res.json({ sucess: false, message: "Error" })
    }
}

export {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrders
};