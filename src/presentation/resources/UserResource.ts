class UserResource {
    constructor() {
    }

    async init(model: any) {
        if (Array.isArray(model)) {
            let resources = [];
            for (let i = 0; i < model.length; i++) {
                resources.push(await this.initializeResource(model[i]));
            }
            return resources;
        } else {
            return await this.initializeResource(model);
        }
    }

    async initializeResource(user: any) {
        return {
            id: user.id,
            email: user.email,
        };
    }
}
export default UserResource;
