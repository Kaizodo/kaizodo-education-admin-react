import { LuStar } from "react-icons/lu";

interface StarRatingProps {
    rating?: number;
    maxStars?: number;
    size?: number;
    onRatingChange?: (rating: number) => void;
}

export default function StarRating({
    rating = 0,
    maxStars = 5,
    size = 25,
    onRatingChange,
}: StarRatingProps) {
    const isInteractive = typeof onRatingChange === "function";

    return (
        <div className={`flex gap-1 ${!isInteractive ? "pointer-events-none" : ""}`}>
            {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => isInteractive && onRatingChange!(star)}
                    className={`${isInteractive
                        ? "transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                        : ""
                        }`}
                >
                    <LuStar
                        style={{
                            width: size,
                            height: size
                        }}
                        className={` ${star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                            }`}
                    />
                </button>
            ))}
        </div>
    );
};

