
        import {v2 as cloudinary} from "cloudinary";


        cloudinary.config({
        	cloud_name: "dq8n2cyzw",
        	api_key: "497774265625923",
        	api_secret: "qhK7bWRNVx1fthhLW5k-TwkMcd8",
        });

		export function uploadToCloudinary(data: Buffer, resource_type: any, folder: string): Promise<string> {
			return new Promise((resolve, reject) => {
				cloudinary.uploader.upload_stream(
					{
						resource_type,
						folder,
						transformation: [{ quality: "auto" }],
					},
					(error, result) => {
						if (error) {
							reject(error);
						} else {
							resolve(result!.url);
						}
					}
				).end(data);
		});
		}


		export function deleteFromCloudinary(public_id: string): Promise<void> {
			return new Promise((resolve, reject) => {
			  cloudinary.uploader.destroy(public_id, (error, result) => {
				if (error) {
				  reject(error);
				} else {
				  resolve(result);
				}
			  });
			});
		  }
		