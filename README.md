# AI Admin - 智能管理后台

基于 Next.js + FastAPI 的 AI 智能管理后台系统，支持用户、产品、订单管理，并集成 AI 智能客服功能。

## 技术栈

### 前端
- **框架**: Next.js 16.1.6 (App Router)
- **UI**: React 19.2.3, Tailwind CSS 4
- **图表**: recharts 3.7.0
- **图标**: @heroicons/react 2.2.0

### 后端
- **框架**: FastAPI (Python)
- **AI 引擎**: LangGraph + 智谱 AI (GLM-4)
- **数据库**: MySQL + Prisma ORM
- **AI ORM**: Tortoise ORM (用于 LangGraph 工具)

## 项目结构

```
ai_admin/
├── api/                      # Python 后端服务
│   └── ai_api/
│       ├── main.py           # FastAPI 主入口
│       ├── db.py             # 数据库配置
│       └── model/            # Tortoise ORM 模型
├── prisma/
│   └── schema.prisma         # Prisma 数据库模型
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # 仪表盘首页
│   │   ├── login/           # 登录页
│   │   ├── users/           # 用户管理
│   │   ├── products/        # 产品管理
│   │   ├── orders/          # 订单管理
│   │   └── api/             # 前端 API 代理
│   └── components/          # React 组件
│       ├── layout/          # 布局组件
│       └── ChatWidget.tsx   # AI 聊天组件
└── public/                  # 静态资源
```

## 功能特性

- **用户管理**: 增删改查用户信息
- **产品管理**: 产品列表、分类、库存管理
- **订单管理**: 订单查看、状态管理
- **AI 客服**: 基于 LangGraph 的智能对话，支持数据库查询
- **流式响应**: SSE 实现 AI 回复流式输出

## 快速开始

### 1. 环境要求

- Node.js 18+
- Python 3.9+
- MySQL 8.0+

### 2. 安装依赖

```bash
# 前端依赖
npm install

# 后端依赖 (建议使用虚拟环境)
cd api/ai_api
pip install -r requirements.txt
```

### 3. 配置环境变量

创建 `.env` 文件：

```env
# 数据库
DATABASE_URL="mysql://root:root123@localhost:3306/ai_admin"

# 智谱 AI API Key
ZHIPUAI_API_KEY="your-zhipuai-api-key"
```

### 4. 初始化数据库

```bash
# Prisma 生成客户端
npx prisma generate

# 推送 schema 到数据库
npx prisma db push
```

### 5. 启动服务

```bash
# 启动前端 (端口 3000)
npm run dev

# 启动后端 (端口 8000)
cd api/ai_api
python main.py
```

### 6. 访问系统

- 前端: http://localhost:3000
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

## AI 客服功能

聊天组件位于页面右下角，支持：

- **智能路由**: 根据问题关键词自动判断是否需要查询数据库
- **数据库查询**: 可查询用户、产品、订单信息
- **流式输出**: SSE 实现逐字流式回复
- **会话隔离**: 使用 token 前 10 位作为会话 ID

### AI 工具函数

| 函数 | 功能 |
|------|------|
| `get_user_info` | 根据邮箱/姓名/ID 获取用户信息 |
| `get_product_info` | 根据产品ID/名称获取产品信息 |
| `get_order_info` | 根据订单ID/用户ID/产品ID查询订单 |

## API 接口

### 后端 (FastAPI)

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/chat/{thread_id}` | AI 聊天接口 (SSE 流式) |

### 前端 (Next.js)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/users` | 获取用户列表 |
| POST | `/api/users` | 创建用户 |
| GET | `/api/users/[id]` | 获取用户详情 |
| PUT | `/api/users/[id]` | 更新用户 |
| DELETE | `/api/users/[id]` | 删除用户 |
| GET | `/api/products` | 获取产品列表 |
| POST | `/api/products` | 创建产品 |
| GET | `/api/orders` | 获取订单列表 |

### 附图
<img width="2560" height="1293" alt="1772024709764" src="https://github.com/user-attachments/assets/f16d1f3f-ea45-4817-99db-1f5ae1e63064" />
<img width="2560" height="1293" alt="1772024601479" src="https://github.com/user-attachments/assets/78251e98-1fba-4d9a-9ee4-4c635d28e7e4" />
<img width="2560" height="1293" alt="1772024644120" src="https://github.com/user-attachments/assets/043620d7-14ad-4033-a887-4af1fc37a00f" />

