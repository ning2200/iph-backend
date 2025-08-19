import firestoreDB from "../config/firebase_config.cjs";

export function queryDB(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const unsubscribe = firestoreDB.collection('auth')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const data = snapshot.docs.reduce((acc, doc) =>  {
                acc[doc.id] = doc.data();
                return Object.entries(acc);
            }, {});

            res.write(`data: ${JSON.stringify(data)}\n\n`);
        });

    req.on('close', () => {
        unsubscribe();
        res.end();
    });
}

// why cannot extract into function
// test with >1 arbitrary data and check array indexes 