exports.runMCMF = function (trip) {
    class Edge {
        constructor(u, v, cap, cost) {
            this.u = u;
            this.v = v;
            this.cap = cap;
            this.cost = cost;
            this.f = 0;
        }

        getCost(w) {
            if (w == this.u) return -this.cost;
            return this.cost;
        }

        other(vertex) {
            if (vertex == this.u) return this.v;
            else if (vertex == this.v) return this.u;
            return -1;
        }

        residualTo(vertex) {
            if (vertex == this.u) return this.f;
            return this.cap - this.f;
        }

        addFlowTo(vertex, ff) {
            if (vertex == this.u) {
                this.f -= ff;
            } else if (vertex == this.v) {
                this.f += ff;
            }
        }
    }

    var MAX_V;
    var INF = 1e9;
    var SRC = 0;
    var SINK = 1;
    var total;
    var Flow;
    var parent = [];
    var visited = [];
    var adj = [[]];
    var vertices = [];
    var dist = [];

    function addEdge(u, v, cap, cost) {
        var e = new Edge(u, v, cap, cost);
        adj[u].push(e);
        adj[v].push(e);
    }

    // Bellman Ford Algorithm
    function SSSP() {
        for (var l = 0; l < MAX_V; l++) {
            dist[l] = INF;
            parent[l] = null;
        }
        dist[SRC] = 0;
        for (var i = 0; i < vertices.length - 1; i++) {
            for (var j = 0; j < vertices.length; j++) {
                var u = j;
                if (dist[u] != INF) {
                    for (var k = 0; k < adj[u].length; k++) {
                        var e = adj[u][k];
                        var v = e.other(u);
                        if (e.residualTo(v) > 0 && dist[u] + e.getCost(v) < dist[v]) {
                            parent[v] = e;
                            dist[v] = dist[u] + e.getCost(v);
                        }
                    }
                }
            }
        }
        return dist[SINK] != INF;
    }

    // Ford Fulkerson
    function maxFlow() {
        var i, j, v;
        for (i = 0; i < adj.length; i++) {
            for (j = 0; j < adj[i].length; j++) {
                adj[i][j].f = 0;
            }
        }

        var mf = 0;
        while (SSSP()) {
            Flow = INF;

            for (v = SINK; v != SRC; v = parent[v].other(v)) {
                Flow = min(Flow, parent[v].residualTo(v));
            }

            for (v = SINK; v != SRC; v = parent[v].other(v)) {
                parent[v].addFlowTo(v, Flow);
                var e = parent[v];
            }
            mf += Flow;
        }
        return mf;
    }

    function min(a, b) {
        return a < b ? a : b;
    }

    // Array.prototype.assign = function (n, v) {
    //     for (var i = 0; i < n; i++) {
    //         this[i] = v;
    //     }
    // };

    // function data() {
    //     total = 5;
    //     MAX_V = total + 2;
    //     adj.assign(MAX_V, []);
    //     vertices.assign(MAX_V, 0);
    //     addEdge(SRC, 2, 10, 1);
    //     addEdge(SRC, 4, 5, 1);
    //     addEdge(SRC, 5, 15, 1);
    //     for (var i = 2; i <= 6; i++) {
    //         for (var j = i + 1; j <= 6; j++) {
    //             addEdge(i, j, 100, 100);
    //             addEdge(j, i, 100, 100);
    //         }
    //         addEdge(i, SINK, 6, 1);
    //     }
    // }

    // function data2() {
    //     total = 3;
    //     MAX_V = total + 2;
    //     adj.assign(MAX_V, []);
    //     vertices.assign(MAX_V, 0);
    //     addEdge(SRC, 2, 9, 1);
    //     addEdge(SRC, 3, 15, 1);
    //     for (var i = 2; i < 2 + total; i++) {
    //         for (var j = i + 1; j < 2 + total; j++) {
    //             addEdge(i, j, INF, 100);
    //             addEdge(j, i, INF, 100);
    //         }
    //         addEdge(i, SINK, 6, 1);
    //     }
    // }

    function parseTrip(trip) {
        var purchasers = trip.purchasers;
        var items = trip.items;
        var consumers = trip.consumers;
        
	    var p2nMap = new Map();
        var n2pMap = new Map();

        var pur = new Map();
        var con = new Map();
        var itm = new Map();

        var i;
        for (i = 0; i < consumers.length; i++) {
            var c = consumers[i];
            p2nMap.set(c.name, i+2);
            n2pMap.set(i+2, c.name);
            con.set(i+2, 0);
        }

        for (i = 0; i < items.length; i++) {
            var t = items[i];
            for (j = 0; j < t.purchasers.length; j++) {
                var cur = t.purchasers[j].name;
                var amount = t.payments[j];
                var p = p2nMap.get(cur);
                if (!pur.has(p)) 
                    pur.set(p, 0);
                pur.set(p, pur.get(p)+amount);
                if (!itm.has(t))
                    itm.set(t, 0);
                itm.set(t, itm.get(t)+amount);
            }
        }
        for (i = 0; i < items.length; i++) {
            var t = items[i];
            for (j = 0; j < t.consumers.length; j++) {
                var c = p2nMap.get(t.consumers[j].name);
                var amount = itm.get(t);
                var num = t.consumers.length;
                con.set(c, con.get(c)+amount/num);
            }
        }

        total = consumers.length;
        MAX_V = total + 2;
        for (i = 0; i < MAX_V; i++) {
            adj[i] = [];
            vertices[i] = 0;
        }
        console.log("pur: ", pur);
        console.log("con: ", con);
        
        pur.forEach(addSrcEdge);
        for (var i = 2; i < MAX_V; i++) {
            for (var j = i + 1; j < MAX_V; j++) {
                addEdge(i, j, INF, 100);
                addEdge(j, i, INF, 100);
            }
            addEdge(i, SINK, con.get(i), 1);
            // console.log(i, adj[i].length);
        }
                
        console.log(maxFlow());
        var result = "";
        for (var i = 2; i < adj.length; i++) {
            // console.log(adj[i].length);
            for (var j = 0; j < adj[i].length; j++) {
                var e = adj[i][j];
                if (e.f && i == e.u && e.v != 1) {
                    result += (n2pMap.get(e.v) + " needs to pay " + n2pMap.get(e.u) + ": " + e.f.toFixed(2) + " dollars.\n");
                }
            }
        }

        return result;
    }

    function addSrcEdge(value, key, map) {
        addEdge(SRC, key, value, 1);
    }

    return parseTrip(trip);
};