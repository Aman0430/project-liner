import prisma from "@/prisma"
import { connectToDB } from "@/app/utils"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

export const GET = async () => {
    try {
        await connectToDB()
        const tweets = await prisma.tweets.findMany()
        return NextResponse.json({ tweets }, { status: 200 })
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

export const POST = async (req: Request) => {
    try {
        const { tweet, userId } = await req.json()
        if (!tweet || !userId) {
            return NextResponse.json({ error: "Invalid data" }, { status: 422 })
        }
        await connectToDB()
        const user = await prisma.user.findFirst({ where: { id: userId } })
        if (!user) {
            return NextResponse.json({ message: "invalid User" }, { status: 401 })
        }

        const newtweet = await prisma.tweets.create({
            data: { tweet, userId }
        })
        return NextResponse.json({ tweet: newtweet }, { status: 201 })
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
