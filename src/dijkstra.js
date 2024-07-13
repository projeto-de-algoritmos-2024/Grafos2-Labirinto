const Heap = require('heap-js').Heap;

class Dijkstra {
    constructor(matrix, startPoint, endPoint) {
        this.matrix = matrix;
        this.startPoint = startPoint;
        this.endPoint = endPoint;

        this.findShortestPaths();
        this.getShortestPath();
    }

    findShortestPaths() {
        const referencePoint = this.startPoint;
        const matrix = this.matrix;

        const h = matrix.length;
        const w = matrix[0].length;

        const distanceToReference = Array.from({ length: h }, () => Array(w).fill(Infinity));
        const visited = Array.from({ length: h }, () => Array(w).fill(false));
        const prevPoints = Array.from({ length: h }, () => Array(w).fill(null));

        distanceToReference[referencePoint[0]][referencePoint[1]] = 0;

        const directions = [[0, 1], [1, 0], [-1, 0], [0, -1]];

        const minHeap = new Heap((a, b) => a[0] - b[0]);
        minHeap.push([distanceToReference[referencePoint[0]][referencePoint[1]], referencePoint[0], referencePoint[1]]);

        let visitedCount = 0;
        const numberOfPoints = h * w;

        while (visitedCount < numberOfPoints) {
            const [pointDist, line, col] = minHeap.pop();

            if (visited[line][col]) continue;

            for (const [dX, dY] of directions) {
                const auxLine = line + dX;
                const auxCol = col + dY;

                if (auxLine >= 0 && auxLine < h && auxCol >= 0 && auxCol < w && !visited[auxLine][auxCol]) {
                    const distToNewPoint = pointDist + matrix[auxLine][auxCol];
                    if (distToNewPoint < distanceToReference[auxLine][auxCol]) {
                        distanceToReference[auxLine][auxCol] = distToNewPoint;
                        prevPoints[auxLine][auxCol] = [line, col];
                        minHeap.push([distToNewPoint, auxLine, auxCol]);
                    }
                }
            }

            visited[line][col] = true;
            visitedCount += 1;
        }

        this.distanceToReference = distanceToReference;
        this.prevPoints = prevPoints;

        return { distanceToReference, prevPoints };
    }

    getShortestPath() {
        let referencePoint = this.endPoint;
        const auxMatrix = this.matrix.map(row => [...row]);
        const prevPoints = this.prevPoints;
        const path = [];

        let currentPoint = referencePoint;
        while (currentPoint) {
            path.unshift(currentPoint);
            auxMatrix[currentPoint[0]][currentPoint[1]] = 2;
            currentPoint = prevPoints[currentPoint[0]][currentPoint[1]];
        }

        this.shortestPath = path;
        return path;
    }
}

if (require.main === module) {
    const maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
        [1, 0, 0, 0, 1, 0, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const d = new Dijkstra(maze, [1, 1], [7, 7]);
    console.log(d.shortestPath);
}
