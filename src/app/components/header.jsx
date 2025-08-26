import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Avatar, Typography } from '@mui/material';
export default function Header({ cartOpen, setCartOpen, getTotalItems }) {
  return (
    <nav
      className="navbar sticky-top shadow-sm"
      style={{
        // Soft gradient background
        background: "linear-gradient(90deg, #FF7F50, #FF6347)",
        color: "white",

      }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        {/* Brand / Title */}
        <Avatar alt="Turkish Shawarma" sx={{ width: 64, height: 64 }} src="/logo/turkish_head.jpg" />
        <Typography variant="h5" sx={{ flexGrow: 1, marginLeft: 2, fontWeight: 'bold' }}>
          Turkish Shawarma
        </Typography>

        {/* Cart button */}
        <button
          className="btn position-relative"
          onClick={() => setCartOpen(!cartOpen)} // Toggle cart visibility
          style={{
            background: "#fff",          // White button
            color: "#FF6347",            // Brand color text
            fontWeight: "bold",
            borderRadius: "50px",        // Rounded pill shape
            padding: "0.5rem 1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // Soft shadow
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <ShoppingCartIcon />

          {/* Badge for number of items */}
          {getTotalItems() > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            >
              {getTotalItems()}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
