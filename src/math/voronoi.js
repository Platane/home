import { computeCircle } from './delaunay'

export const voronoi = (points, triangles) => {
    const centers = triangles.map(vertices =>
        computeCircle(vertices.map(i => points[i]))
    )

    const faces = []

    points.forEach((_, i) => {
        // every triangle which contains the vertice i
        const edges = []

        triangles.forEach((vertices, k) => {
            if (vertices.some(x => i == x))
                edges.push([...vertices.filter(x => i != x), k])
        })

        if (edges.length == 0) return

        let [a, e, k] = edges.shift()
        const hull = [k]

        while (a != e) {
            const i = edges.findIndex(x => x[0] == e || x[1] == e)

            if (i == -1)
                // if the hull is not closed, ignore ( it' because the triangle is part of the global hull )
                return

            e = edges[i][0] == e ? edges[i][1] : edges[i][0]

            hull.push(edges.splice(i, 1)[0][2])
        }

        faces.push(hull)
    })

    return { faces, vertices: centers }
}
