import { clerkClient } from '@clerk/nextjs/server'
import { WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'

import {createUser} from "../../../../../../movie_backend/controller/userController"

export async function POST(req:Request) {
    
}