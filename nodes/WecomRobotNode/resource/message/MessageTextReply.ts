import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '文本消息回复',
	value: 'message:textReply',
	options: [
		{
			displayName: '*回复内容',
			name: 'content',
			default: '',
			type: 'string',
			required: true,
		},
		{
			displayName: '图片列表',
			name: 'images',
			description: "最多10张图片",
			options: [
				{
					name: 'urls',
					displayName: '图片列表',
					values: [
						{
							displayName: '图片地址/Base64',
							name: 'url',
							type: 'string',
							default: '',
						},
					],
				},
			],
			type: 'fixedCollection',
			default: [],
			typeOptions: {
				multipleValues: true,
			},
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const content = this.getNodeParameter('content', index) as string;
		const imageData = this.getNodeParameter('images', index) as IDataObject;
		const imageUrls = ((imageData?.urls as IDataObject[]) || []).map(item => item.url as string);
		// 并发获取图片的base64和md5

		const promises = []

		const images: any[] = [];

		for (const imageUrl of imageUrls) {
			promises.push((async () => {
				let base64 = null;
				if (imageUrl.startsWith('http')) {
					try {
						base64 = await RequestUtils.getImageBase64.call(this, imageUrl);
					}catch (e){
						throw new Error("下载图片失败: " + e.message)
					}
				}else{
					base64 = imageUrl;
				}

				images.push({
					msgtype: 'image',
					image: {
						base64: base64,
						md5: RequestUtils.getImageMd5(base64),
					},
				})
			})())
		}

		await Promise.all(promises);

		return {
			msgtype: 'stream',
			stream: {
				id: 'STREAMID',
				finish: true,
				content: content,
				msg_item: images,
			},
		};
	},
} as ResourceOperations;
