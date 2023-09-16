import { connectToDB } from "@/app/utils";
import prisma from "@/prisma"
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"

export const POST = async (req: Request) => {
    try {
        const { name, email, password } = await req.json()
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Invalid data" }, { status: 422 })
        }
        await connectToDB()
        const existingUser = await prisma.user.findFirst({ where: { email } })
        if (existingUser) {
            return NextResponse.json(
                { message: "User already registered, please login" },
                { status: 403 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const users = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        })
        return NextResponse.json({ users }, { status: 200 })
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
