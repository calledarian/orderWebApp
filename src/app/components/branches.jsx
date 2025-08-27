import ForkRightIcon from '@mui/icons-material/ForkRight';

const Branches = ({ branches, selectedBranch, setSelectedBranch }) => (
    <div className="row g-3">
        {branches.map(branch => (
            <div
                key={branch.id}
                className={`
          col-12 p-3 border rounded mb-2 d-flex justify-content-between align-items-center
          transition-transform duration-300 ease-in-out
          hover:shadow-lg hover:scale-105
          ${selectedBranch?.id === branch.id ? "bg-primary text-white shadow-xl scale-105" : ""}
        `}
                onClick={() => setSelectedBranch(branch)}
                style={{ cursor: "pointer" }}
            >
                {/* Text section */}
                <div>
                    <h5 className="mb-1">{branch.name}</h5>
                    <p className="mb-0">{branch.address}</p>
                </div>

                {/* Icon section */}
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${branch.map.lat},${branch.map.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <ForkRightIcon
                        style={{
                            fontSize: "40px", // bigger icon
                            color: selectedBranch?.id === branch.id ? "white" : "#007bff",
                        }}
                    />
                </a>
            </div>
        ))}
    </div>
);

export default Branches;
