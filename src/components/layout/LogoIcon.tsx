const LOGO_URL = "https://www.lorana.com.br/img/lorena-branco1.png";

// Pixel bounds of the icon glyph within the full lockup image (2370x1185),
// isolated so it can be shown without the "LORANA" wordmark baked into it.
const CROP = { fullW: 2370, fullH: 1185, x: 910, y: 0, w: 540, h: 630 };

interface LogoIconProps {
  height: number;
  className?: string;
}

export function LogoIcon({ height, className }: LogoIconProps) {
  const scale = height / CROP.h;
  const width = CROP.w * scale;

  return (
    <span
      role="img"
      aria-label="Lorana"
      className={className}
      style={{
        display: "inline-block",
        width,
        height,
        backgroundImage: `url(${LOGO_URL})`,
        backgroundSize: `${CROP.fullW * scale}px ${CROP.fullH * scale}px`,
        backgroundPosition: `${-(CROP.x * scale)}px ${-(CROP.y * scale)}px`,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
