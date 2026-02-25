export interface UserModel {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
}

export async function GetUsers() {
    const users: UserModel[] = [
        { id: 1, name: "张三", email: "zhangsan@example.com", role: "Admin", status: "Active", createdAt: "2024-01-15" },
        { id: 2, name: "李四", email: "lisi@example.com", role: "User", status: "Active", createdAt: "2024-02-20" },
        { id: 3, name: "王五", email: "wangwu@example.com", role: "User", status: "Inactive", createdAt: "2024-03-10" },
        { id: 4, name: "赵六", email: "zhaoliu@example.com", role: "Editor", status: "Active", createdAt: "2024-04-05" },
    ];
    return Response.json(users);
}

export async function PostUser(request: Request) {
    const user: UserModel = await request.json();
    return Response.json(user);
}

export async function PutUser(request: Request) {
    const user: UserModel = await request.json();
    return Response.json(user);
}

export async function DeleteUser(request: Request) {
    const user: UserModel = await request.json();
    return Response.json(user);
}
