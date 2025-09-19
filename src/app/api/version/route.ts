import { NextResponse } from 'next/server'

export async function GET() {
  const commitSha = (process.env.VERCEL_GIT_COMMIT_SHA || process.env.COMMIT_SHA || 'commit').slice(
    0,
    7
  )
  const fullDeploymentId = process.env.VERCEL_DEPLOYMENT_ID || 'deploy'
  const deploymentId = fullDeploymentId.startsWith('dpl_')
    ? fullDeploymentId.slice(4, 13) // Skip 'dpl_' and take next 9 chars
    : fullDeploymentId.slice(0, 9) // If no 'dpl_' prefix, just take first 9

  return NextResponse.json({
    version: commitSha,
    deploymentId: deploymentId,
  })
}
