# 企业微信智能机器人对接
https://developer.work.weixin.qq.com/document/path/101039

## 签名
- 消息加密
- 消息解密
## 消息
- 文本消息回复


# 验证URL有效性
```json
{
  "nodes": [
    {
      "parameters": {
        "path": "a332432e-617d-41d4-a8d3-03d47a067be7",
        "responseMode": "responseNode",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        -432,
        -224
      ],
      "id": "6b3b6b63-683a-45b0-9f7c-569902c3e7c3",
      "name": "Webhook",
      "webhookId": "a332432e-617d-41d4-a8d3-03d47a067be7"
    },
    {
      "parameters": {
        "respondWith": "text",
        "responseBody": "={{ $('消息解密2').item.json.msg }}",
        "options": {}
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.4,
      "position": [
        528,
        -224
      ],
      "id": "e9c437ad-e0c0-4e05-8bee-b9408a71e1b5",
      "name": "验证响应"
    },
    {
      "parameters": {
        "resource": "sign",
        "operation": "sign:decrypt",
        "data": "={{ $json.query.echostr}}",
        "nonce": "={{ $json.query.nonce }}",
        "timestamp": "={{ $json.query.timestamp }}",
        "signature": "={{ $json.query.msg_signature }}"
      },
      "type": "n8n-nodes-wecom-robot.wecomRobotNode",
      "typeVersion": 1,
      "position": [
        0,
        -224
      ],
      "id": "7f9ec4fd-8dce-4652-9e7f-287a7ec586ff",
      "name": "消息解密2",
      "credentials": {
        "wecomRobotCredentialsApi": {
          "id": "0hp6CFGQA7pUAe6q",
          "name": "Wecom Robot Credentials account"
        }
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "消息解密2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "消息解密2": {
      "main": [
        [
          {
            "node": "验证响应",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "0df765b3d0993112e88e19d04d39f740e9de5a025e7bc18393c83fe1ab44211e"
  }
}
```

# 消息回复
```json
{
	"nodes": [
		{
			"parameters": {
				"httpMethod": "POST",
				"path": "a332432e-617d-41d4-a8d3-03d47a067be7",
				"responseMode": "responseNode",
				"options": {}
			},
			"type": "n8n-nodes-base.webhook",
			"typeVersion": 2,
			"position": [
				-3664,
				-80
			],
			"id": "c864f2fc-5766-4119-8fe7-26c9f7d1bdee",
			"name": "Webhook1",
			"webhookId": "a332432e-617d-41d4-a8d3-03d47a067be7"
		},
		{
			"parameters": {
				"jsCode": "return JSON.parse($input.first().json.msg)"
			},
			"type": "n8n-nodes-base.code",
			"typeVersion": 2,
			"position": [
				-2720,
				-80
			],
			"id": "042f8f08-0306-4b80-ad2b-38562a03f295",
			"name": "解析数据格式"
		},
		{
			"parameters": {
				"respondWith": "json",
				"responseBody": "={{ JSON.stringify($('消息加密').item.json) }}",
				"options": {}
			},
			"type": "n8n-nodes-base.respondToWebhook",
			"typeVersion": 1.4,
			"position": [
				-1648,
				-80
			],
			"id": "08d96c71-2f87-4231-844b-12efe9e08939",
			"name": "Respond to Webhook"
		},
		{
			"parameters": {
				"resource": "sign",
				"operation": "sign:decrypt",
				"data": "={{ $json.body.encrypt }}",
				"nonce": "={{ $json.query.nonce }}",
				"timestamp": "={{ $json.query.timestamp }}",
				"signature": "={{ $json.query.msg_signature }}"
			},
			"type": "n8n-nodes-wecom-robot.wecomRobotNode",
			"typeVersion": 1,
			"position": [
				-3216,
				-80
			],
			"id": "30fe137f-235e-4ab5-a7bb-3e02f06c3d09",
			"name": "消息解密",
			"credentials": {
				"wecomRobotCredentialsApi": {
					"id": "0hp6CFGQA7pUAe6q",
					"name": "Wecom Robot Credentials account"
				}
			}
		},
		{
			"parameters": {
				"resource": "sign",
				"operation": "sign:encrypt",
				"data": "={{ $input.item.json }}",
				"nonce": "={{ $('Webhook1').item.json.query.nonce }}"
			},
			"type": "n8n-nodes-wecom-robot.wecomRobotNode",
			"typeVersion": 1,
			"position": [
				-1952,
				-80
			],
			"id": "122d681e-4c5b-4300-8527-047e5a88dcfe",
			"name": "消息加密",
			"credentials": {
				"wecomRobotCredentialsApi": {
					"id": "0hp6CFGQA7pUAe6q",
					"name": "Wecom Robot Credentials account"
				}
			}
		},
		{
			"parameters": {
				"resource": "message",
				"operation": "message:textReply",
				"content": "=回复测试"
			},
			"type": "n8n-nodes-wecom-robot.wecomRobotNode",
			"typeVersion": 1,
			"position": [
				-2304,
				-80
			],
			"id": "d445bab9-a534-47c2-888d-360df96e55da",
			"name": "文本消息回复",
			"credentials": {
				"wecomRobotCredentialsApi": {
					"id": "0hp6CFGQA7pUAe6q",
					"name": "Wecom Robot Credentials account"
				}
			}
		}
	],
	"connections": {
		"Webhook1": {
			"main": [
				[
					{
						"node": "消息解密",
						"type": "main",
						"index": 0
					}
				]
			]
		},
		"解析数据格式": {
			"main": [
				[
					{
						"node": "文本消息回复",
						"type": "main",
						"index": 0
					}
				]
			]
		},
		"消息解密": {
			"main": [
				[
					{
						"node": "解析数据格式",
						"type": "main",
						"index": 0
					}
				]
			]
		},
		"消息加密": {
			"main": [
				[
					{
						"node": "Respond to Webhook",
						"type": "main",
						"index": 0
					}
				]
			]
		},
		"文本消息回复": {
			"main": [
				[
					{
						"node": "消息加密",
						"type": "main",
						"index": 0
					}
				]
			]
		}
	},
	"pinData": {},
	"meta": {
		"instanceId": "0df765b3d0993112e88e19d04d39f740e9de5a025e7bc18393c83fe1ab44211e"
	}
}
```
