import type { Point } from '../../../type';

export const getCenter = (polygon: Array<Point>): Point => {
    const c = { x: 0, y: 0 };

    if (polygon.length == 0) return c;

    polygon.forEach(({ x, y }) => {
        c.x += x;
        c.y += y;
    });

    c.x /= polygon.length;
    c.y /= polygon.length;

    return c;
};

export const enflate = (polygon: Array<Point>, m: number): Array<Point> => {
    const c = getCenter(polygon);

    return polygon.map(p => {
        const vx = p.x - c.x;
        const vy = p.y - c.y;

        const l = Math.sqrt(vx * vx + vy * vy);

        return {
            x: c.x + vx / l * (l + m),
            y: c.y + vy / l * (l + m),
        };
    });
};
