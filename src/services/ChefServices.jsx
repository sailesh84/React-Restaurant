export const ChefServices = {
    getData() {
        return [];
    },

    getChefSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },
    
    getChefMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },
    
    getChefLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },
    
    getChefXLarge() {
        return Promise.resolve(this.getData());
    },
}