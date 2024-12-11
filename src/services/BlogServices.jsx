export const BlogServices = {
    getData() {
        return [];
    },

    getBlogSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },
    
    getBlogMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },
    
    getBlogLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },
    
    getBlogXLarge() {
        return Promise.resolve(this.getData());
    },
}