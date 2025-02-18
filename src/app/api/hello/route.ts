import { NextResponse } from 'next/server';

let users = [{ id: 1, name: 'John Doe' }];

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const newUser = { id: users.length + 1, name };
  users.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
}

export async function PUT(req: Request) {
  return NextResponse.json({ message: 'PUT request received' });
}

export async function DELETE(req: Request) {
  return NextResponse.json({ message: 'DELETE request received' });
}
