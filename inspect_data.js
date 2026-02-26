const axios = require('axios');
async function inspect() {
    try {
        const response = await axios.get('https://deepstatemap.live/api/history/last');
        const geoJson = response.data.map;
        console.log('First feature properties:', JSON.stringify(geoJson.features[0].properties, null, 2));
        console.log('All unique types in properties:');
        const types = new Set();
        geoJson.features.forEach(f => {
            if (f.properties) {
                // Check common property names
                if (f.properties.type !== undefined) types.add(f.properties.type);
                if (f.properties.fill !== undefined) types.add(f.properties.fill);
            }
        });
        console.log(Array.from(types));
    } catch (e) {
        console.error(e);
    }
}
inspect();
