import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function StarRating({ rating }) {

    const roundRating = Math.round(rating)

    return (
       <div style={{ display: "flex", gap: "4px" }}>
        {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon
                key={i}
                icon={faStar}
                style={{color: i < roundRating ? "#f5c518" : "#d3d3d3"}}
            />
        ))}

       </div>
    )
}