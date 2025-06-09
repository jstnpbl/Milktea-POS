# 🧋 Milk Tea Shop POS System

A complete, modern point-of-sale system designed specifically for small milk tea businesses, featuring beautiful pastel aesthetics and comprehensive order management capabilities.

Built as a fully functional, single-page application that requires no backend infrastructure, this POS system provides everything a milk tea shop needs to process orders, manage inventory, and track daily sales with an intuitive, touch-friendly interface.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Instructions](#usage-instructions)
- [Roadmap](#roadmap)
- [Known Issues](#known-issues)
- [Learnings](#learnings)
- [License](#license)
- [Author](#author)

## Features

- **🎨 Beautiful UI/UX Design**
  - Milk tea-inspired pastel color palette (lavender, mocha, cream, pink, mint)
  - Responsive design optimized for both desktop and tablet/mobile use
  - Touch-friendly interface with smooth animations and hover effects

- **🧋 Comprehensive Menu System**
  - 10+ drinks per category, with clear category separation for easy scanning
  - Visual product icons and clear pricing display
  - Easy-to-navigate category-based menu organization
  - **Add Drink** button for each category, allowing staff to add new drinks on the fly

- **🍡 Advanced Toppings Customization**
  - 6 different topping options with individual pricing
  - Multiple toppings selection per item
  - Real-time price calculation including add-ons

- **🛒 Smart Cart Management**
  - Real-time cart updates with quantity controls
  - Individual item modification and removal
  - Automatic subtotal and total calculations

- **💰 Professional Checkout System**
  - Automatic tax calculation (8.5% configurable)
  - Percentage-based discount system
  - Cash payment processing with change calculation
  - Input validation and error handling

- **🧾 Digital Receipt Generation**
  - Professional receipt layout with shop branding
  - Itemized breakdown including toppings
  - Print-ready formatting using browser print dialog
  - Order numbering and timestamp tracking

- **📊 Sales Analytics Dashboard**
  - Daily sales summary with total orders and revenue
  - Complete order history with timestamps
  - Session-based data tracking (no database required)

- **🖼️ Favicon and Branding**
  - Custom favicon support for a professional browser appearance

## Screenshot

![image](https://github.com/user-attachments/assets/7cdbe6fd-f44c-4b1a-b7d7-19ca58afe54f)

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Library:** jQuery 3.6.0
- **Styling:** Custom CSS with CSS Grid and Flexbox
- **Icons:** Unicode emoji and custom CSS icons
- **Print:** Browser native print API
- **Storage:** In-memory JavaScript objects (session-based)

## Project Structure

```
milk_tea_pos/
├── index.html             # Main application file
├── styles.css             # Main stylesheet
├── script.js              # Main JavaScript logic
├── favicon/               # Favicon and manifest files
│   ├── favicon-32x32.png
│   ├── favicon-16x16.png
│   ├── apple-touch-icon.png
│   └── site.webmanifest
├── README.md              # Project documentation
└── assets/                # Optional assets folder
    ├── images/            # Product images (future enhancement)
    └── icons/             # Custom icons (future enhancement)
```

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jstnpbl/Milktea-POS.git
   cd Milktea-POS
   ```

2. **Open the application**
   ```bash
   # Option 1: Open directly in browser
   open index.html
   
   # Option 2: Use a local server (recommended)
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Start using the POS system**
   - No configuration or setup required
   - All data is stored in memory during the session

## Usage Instructions

### Taking Orders

1. **Select Menu Items**
   - Click on any menu item to open the toppings selection modal
   - Choose desired toppings (optional)
   - Click "Add to Cart" to add the item

2. **Manage Cart**
   - Adjust quantities using +/- buttons or direct input
   - Remove items using the "Remove" button
   - Apply discounts using the percentage discount field

3. **Process Payment**
   - Click "Checkout" when order is complete
   - Enter cash amount received
   - System automatically calculates change
   - Click "Complete Payment" to finalize

4. **Generate Receipt**
   - Receipt modal displays automatically after payment
   - Click "Print Receipt" to print using browser dialog
   - Click "New Order" to start fresh

### Viewing Sales Data

1. **Access Sales Tab**
   - Click "Sales History" tab at the top
   - View daily summary with total orders and revenue
   - Browse complete order history with timestamps

### Adding New Drinks

1. **Add Drink to Any Category**
   - Click the "+ Add Drink" button in any drink category
   - Fill in the drink name, price, and (optionally) an emoji icon
   - The new drink will appear instantly in the selected category and is fully functional

## Roadmap

- [ ] **Inventory Management**
  - Stock tracking and low inventory alerts
  - Ingredient cost analysis

- [ ] **Customer Management**
  - Customer database and loyalty program
  - Order history per customer

- [ ] **Advanced Reporting**
  - Export sales data to CSV/PDF
  - Weekly/monthly sales analytics
  - Best-selling items analysis

- [ ] **Payment Integration**
  - Credit card processing
  - Digital payment options (Apple Pay, Google Pay)

- [ ] **Multi-location Support**
  - Chain management features
  - Centralized reporting

- [ ] **Backend Integration**
  - Database persistence
  - Cloud backup and sync

## Known Issues

- **Data Persistence:** All data is session-based and will be lost on page refresh
- **Browser Compatibility:** Optimized for modern browsers; IE not supported
- **Print Styling:** Receipt formatting may vary slightly between browsers
- **Mobile Landscape:** Some UI elements may need adjustment on small landscape screens
- **Added Drinks:** Newly added drinks are not saved after a page refresh (future enhancement: localStorage support)

## Learnings

This project was an excellent exercise in building a complete business application using vanilla web technologies. Key challenges overcome include:

- **Complex State Management:** Managing cart state, order calculations, and sales history without a framework required careful JavaScript architecture
- **Responsive Design:** Creating a touch-friendly interface that works across devices while maintaining professional aesthetics
- **Print Integration:** Implementing browser-native printing for receipts required custom CSS and HTML formatting
- **UX/UI Design:** Balancing visual appeal with functional efficiency for a business-critical application
- **Dynamic Menu Expansion:** Implementing a modal and logic for adding new drinks to any category on the fly

The project demonstrates that powerful, professional applications can be built with fundamental web technologies without requiring complex frameworks or build processes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Your Name**
- GitHub: [@jstnpbl](https://github.com/jstnpbl)

## Acknowledgments

- Inspired by modern milk tea shop operations and POS system requirements
- Color palette inspired by popular bubble tea aesthetics
- Icons and emojis from Unicode standard
- jQuery library for DOM manipulation and event handling
- Special thanks to the bubble tea community for flavor and topping inspiration

---

*Built for the bubble tea community.*
