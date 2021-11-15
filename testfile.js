async function a() {
    if (2 + 2 == 5) return true; else throw "Not True";
}

async function main() {
    try {
        var b = await a()
        console.log(b);
    } catch (err) {
        console.log(err)
    }
    
}

main()