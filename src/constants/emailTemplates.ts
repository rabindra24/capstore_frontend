export const emailTemplates = {
    orderConfirmation: {
        name: "Order Confirmation",
        category: "orders",
        subject: "Order Confirmation - #{{order_number}}",
        preview: "Thank you for your order!",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #1f2937; margin-bottom: 20px;">Order Confirmation</h1>
          <p style="color: #4b5563; font-size: 16px;">Hi {{customer_name}},</p>
          <p style="color: #4b5563; font-size: 16px;">Thank you for your order! We're getting your items ready for shipment.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 10px;">Order Details</h2>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Order Number:</strong> #{{order_number}}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Order Date:</strong> {{order_date}}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Total:</strong> {{order_total}}</p>
          </div>
          
          <div style="margin: 30px 0;">
            <h3 style="color: #1f2937; font-size: 16px; margin-bottom: 15px;">Items Ordered</h3>
            {{order_items}}
          </div>
          
          <p style="color: #4b5563; font-size: 14px; margin-top: 30px;">
            If you have any questions, please don't hesitate to contact us.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              {{store_name}} | {{store_email}}
            </p>
          </div>
        </div>
      </div>
    `,
        variables: ["customer_name", "order_number", "order_date", "order_total", "order_items", "store_name", "store_email"]
    },

    shippingNotification: {
        name: "Shipping Notification",
        category: "shipping",
        subject: "Your Order Has Shipped! 📦",
        preview: "Your order is on its way",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; margin-bottom: 10px;">📦 Your Order Has Shipped!</h1>
            <p style="color: #6b7280; font-size: 16px;">Order #{{order_number}}</p>
          </div>
          
          <p style="color: #4b5563; font-size: 16px;">Hi {{customer_name}},</p>
          <p style="color: #4b5563; font-size: 16px;">Great news! Your order has been shipped and is on its way to you.</p>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h2 style="color: #1e40af; font-size: 18px; margin-bottom: 10px;">Tracking Information</h2>
            <p style="color: #1e3a8a; margin: 5px 0;"><strong>Tracking Number:</strong> {{tracking_number}}</p>
            <p style="color: #1e3a8a; margin: 5px 0;"><strong>Carrier:</strong> {{shipping_carrier}}</p>
            <p style="color: #1e3a8a; margin: 5px 0;"><strong>Estimated Delivery:</strong> {{estimated_delivery}}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{tracking_url}}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Track Your Package
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            You'll receive another email when your package is delivered.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              {{store_name}} | {{store_email}}
            </p>
          </div>
        </div>
      </div>
    `,
        variables: ["customer_name", "order_number", "tracking_number", "shipping_carrier", "estimated_delivery", "tracking_url", "store_name", "store_email"]
    },

    abandonedCart: {
        name: "Abandoned Cart Recovery",
        category: "marketing",
        subject: "You left something behind! 🛒",
        preview: "Complete your purchase",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #1f2937; margin-bottom: 20px;">Don't Miss Out! 🛒</h1>
          <p style="color: #4b5563; font-size: 16px;">Hi {{customer_name}},</p>
          <p style="color: #4b5563; font-size: 16px;">We noticed you left some items in your cart. They're still waiting for you!</p>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h2 style="color: #92400e; font-size: 18px; margin-bottom: 15px;">Items in Your Cart</h2>
            {{cart_items}}
            <p style="color: #92400e; margin-top: 15px; font-size: 18px;"><strong>Total: {{cart_total}}</strong></p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{cart_url}}" style="display: inline-block; background-color: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Complete Your Purchase
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
            Hurry! Items in your cart are selling fast.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              {{store_name}} | {{store_email}}
            </p>
          </div>
        </div>
      </div>
    `,
        variables: ["customer_name", "cart_items", "cart_total", "cart_url", "store_name", "store_email"]
    },

    welcomeEmail: {
        name: "Welcome Email",
        category: "customer",
        subject: "Welcome to {{store_name}}! 🎉",
        preview: "We're excited to have you",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; margin-bottom: 10px;">Welcome to {{store_name}}! 🎉</h1>
          </div>
          
          <p style="color: #4b5563; font-size: 16px;">Hi {{customer_name}},</p>
          <p style="color: #4b5563; font-size: 16px;">Thank you for joining our community! We're thrilled to have you with us.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Here's what you can expect:</h2>
            <ul style="color: #6b7280; line-height: 1.8;">
              <li>Exclusive deals and promotions</li>
              <li>Early access to new products</li>
              <li>Personalized recommendations</li>
              <li>Fast and secure checkout</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{shop_url}}" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Start Shopping
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
            Need help? Our support team is always here for you.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              {{store_name}} | {{store_email}}
            </p>
          </div>
        </div>
      </div>
    `,
        variables: ["customer_name", "store_name", "shop_url", "store_email"]
    },

    reviewRequest: {
        name: "Review Request",
        category: "customer",
        subject: "How was your recent purchase? ⭐",
        preview: "We'd love your feedback",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #1f2937; margin-bottom: 20px;">How Was Your Experience? ⭐</h1>
          <p style="color: #4b5563; font-size: 16px;">Hi {{customer_name}},</p>
          <p style="color: #4b5563; font-size: 16px;">We hope you're enjoying your recent purchase! Your feedback helps us improve and serve you better.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 10px;">Your Recent Order</h2>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Order #{{order_number}}</strong></p>
            {{order_items}}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{review_url}}" style="display: inline-block; background-color: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Leave a Review
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
            Your review helps other customers make informed decisions.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              {{store_name}} | {{store_email}}
            </p>
          </div>
        </div>
      </div>
    `,
        variables: ["customer_name", "order_number", "order_items", "review_url", "store_name", "store_email"]
    },

    specialOffer: {
        name: "Special Offer",
        category: "marketing",
        subject: "Special Offer Just For You! 🎁",
        preview: "Exclusive discount inside",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; margin-bottom: 10px;">Special Offer Just For You! 🎁</h1>
          </div>
          
          <p style="color: #4b5563; font-size: 16px;">Hi {{customer_name}},</p>
          <p style="color: #4b5563; font-size: 16px;">As a valued customer, we're excited to offer you an exclusive discount!</p>
          
          <div style="background-color: #fef2f2; padding: 30px; border-radius: 6px; margin: 20px 0; text-align: center; border: 2px dashed #ef4444;">
            <h2 style="color: #991b1b; font-size: 24px; margin-bottom: 10px;">{{discount_percentage}}% OFF</h2>
            <p style="color: #7f1d1d; font-size: 18px; margin: 10px 0;">Use code: <strong style="background-color: #fee2e2; padding: 5px 15px; border-radius: 4px;">{{coupon_code}}</strong></p>
            <p style="color: #991b1b; font-size: 14px; margin-top: 15px;">Valid until {{expiry_date}}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{shop_url}}" style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Shop Now
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
            Don't miss out on this limited-time offer!
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              {{store_name}} | {{store_email}}
            </p>
          </div>
        </div>
      </div>
    `,
        variables: ["customer_name", "discount_percentage", "coupon_code", "expiry_date", "shop_url", "store_name", "store_email"]
    }
};

export const templateCategories = [
    { value: "all", label: "All Templates" },
    { value: "orders", label: "Orders" },
    { value: "shipping", label: "Shipping" },
    { value: "customer", label: "Customer" },
    { value: "marketing", label: "Marketing" },
];

export type EmailTemplate = typeof emailTemplates[keyof typeof emailTemplates];
