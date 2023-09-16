import { connectToDB } from "@/app/utils";
import prisma from "@/prisma"
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"

export const POST = async (req: Request) => {
    try {
        const { email, password } = await req.json()
        if (!email || !password) {
            return NextResponse.json({ error: "Invalid data" }, { status: 422 })
        }
        await connectToDB()
        const existingUser = await prisma.user.findFirst(
            { where: { email } }
        )
        if (!existingUser) {
            return NextResponse.json(
                { message: "user not registered" },
                { status: 404 })
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        )
        if (!isPasswordCorrect) {
            return NextResponse.json({ error: "Invalid Password" }, { status: 404 })
        }
        return NextResponse.json({ message: "loggedin successfully" }, { status: 200 })
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
