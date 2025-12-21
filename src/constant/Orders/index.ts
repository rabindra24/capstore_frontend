const chatbotOrders = [
  { id: "CB001", customer: "Arjun Mehta", email: "arjun.mehta@email.com", items: 2, total: 159.98, status: "Delivered", date: "2024-01-20", source: "Chatbot" },
  { id: "CB002", customer: "Priya Sharma", email: "priya.sharma@email.com", items: 1, total: 79.99, status: "Shipped", date: "2024-01-21", source: "Chatbot" },
  { id: "CB003", customer: "Ravi Iyer", email: "ravi.iyer@email.com", items: 3, total: 229.97, status: "Processing", date: "2024-01-22", source: "Chatbot" },
  { id: "CB004", customer: "Neha Kapoor", email: "neha.kapoor@email.com", items: 1, total: 99.99, status: "Pending", date: "2024-01-23", source: "Chatbot" },
  { id: "CB005", customer: "Vikram Reddy", email: "vikram.reddy@email.com", items: 4, total: 389.96, status: "Delivered", date: "2024-01-24", source: "Chatbot" },
  { id: "CB006", customer: "Sneha Nair", email: "sneha.nair@email.com", items: 2, total: 149.98, status: "Shipped", date: "2024-01-25", source: "Chatbot" },
  { id: "CB007", customer: "Rahul Desai", email: "rahul.desai@email.com", items: 1, total: 59.99, status: "Processing", date: "2024-01-26", source: "Chatbot" },
];

const woocommerceOrders = [
  { id: "WC001", customer: "Ananya Verma", email: "ananya.verma@email.com", items: 3, total: 299.97, status: "Delivered", date: "2024-01-15", source: "WooCommerce" },
  { id: "WC002", customer: "Rohan Gupta", email: "rohan.gupta@email.com", items: 2, total: 199.98, status: "Shipped", date: "2024-01-16", source: "WooCommerce" },
  { id: "WC003", customer: "Meera Patel", email: "meera.patel@email.com", items: 1, total: 89.99, status: "Processing", date: "2024-01-17", source: "WooCommerce" },
  { id: "WC004", customer: "Karan Malhotra", email: "karan.malhotra@email.com", items: 5, total: 524.95, status: "Pending", date: "2024-01-18", source: "WooCommerce" },
  { id: "WC005", customer: "Tanya Bhatia", email: "tanya.bhatia@email.com", items: 2, total: 179.98, status: "Cancelled", date: "2024-01-19", source: "WooCommerce" },
  { id: "WC006", customer: "Amit Singh", email: "amit.singh@email.com", items: 3, total: 269.97, status: "Delivered", date: "2024-01-20", source: "WooCommerce" },
];

const shopifyOrders = [
  { id: "SF001", customer: "Sanjana Rao", email: "sanjana.rao@email.com", items: 4, total: 399.96, status: "Delivered", date: "2024-01-10", source: "Shopify" },
  { id: "SF002", customer: "Arjun Mehta", email: "arjun.mehta@email.com", items: 2, total: 189.98, status: "Shipped", date: "2024-01-11", source: "Shopify" },
  { id: "SF003", customer: "Kavya Menon", email: "kavya.menon@email.com", items: 1, total: 129.99, status: "Processing", date: "2024-01-12", source: "Shopify" },
  { id: "SF004", customer: "Manish Agarwal", email: "manish.agarwal@email.com", items: 3, total: 289.97, status: "Pending", date: "2024-01-13", source: "Shopify" },
  { id: "SF005", customer: "Diya Joshi", email: "diya.joshi@email.com", items: 2, total: 159.98, status: "Delivered", date: "2024-01-14", source: "Shopify" },
  { id: "SF006", customer: "Suresh Pillai", email: "suresh.pillai@email.com", items: 1, total: 79.99, status: "Shipped", date: "2024-01-15", source: "Shopify" },
  { id: "SF007", customer: "Pooja Khanna", email: "pooja.khanna@email.com", items: 5, total: 549.95, status: "Processing", date: "2024-01-16", source: "Shopify" },
];

export {chatbotOrders, woocommerceOrders, shopifyOrders}