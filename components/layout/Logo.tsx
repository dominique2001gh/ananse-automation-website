import Image from "next/image";
import Link from "next/link";

// Intrinsic pixel dimensions of the cropped source art -- keeping these
// exact preserves the logo's true aspect ratio at any display size.
const LOCKUP_SRC = "/brand/ananse-logo-lockup.png";
const LOCKUP_WIDTH = 1365;
const LOCKUP_HEIGHT = 421;

export default function Logo({
  tone = "light",
  priority = false,
  className = "",
  imageClassName = "h-8 w-auto sm:h-9",
}: {
  tone?: "light" | "dark";
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  const image = (
    <Image
      src={LOCKUP_SRC}
      alt="Ananse Automation"
      width={LOCKUP_WIDTH}
      height={LOCKUP_HEIGHT}
      priority={priority}
      className={imageClassName}
    />
  );

  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      {tone === "dark" ? (
        // The lockup's wordmark is dark ink, so on dark sections it sits on
        // a small paper-colored plate to stay legible without altering the
        // artwork itself.
        <span className="inline-flex items-center rounded-xl bg-paper px-3 py-2">
          {image}
        </span>
      ) : (
        image
      )}
    </Link>
  );
}
