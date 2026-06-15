#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const REQUIRED = ['version', 'id', 'repo', 'steward', 'idea', 'quorum', 'immunity', 'implementation', 'evidence'];

function usage() {
  console.error('Usage: node src/quillcode.mjs <packet.json> [--out <brief.md>]');
}

function assertPacket(packet) {
  const missing = REQUIRED.filter((key) => packet[key] === undefined || packet[key] === null);
  if (missing.length) throw new Error(`Missing required fields: ${missing.join(', ')}`);
  for (const key of ['approved', 'rejected', 'abstained', 'threshold', 'total']) {
    if (!Number.isInteger(packet.quorum?.[key])) throw new Error(`quorum.${key} must be an integer`);
  }
  const counted = packet.quorum.approved + packet.quorum.rejected + packet.quorum.abstained;
  if (counted !== packet.quorum.total) {
    throw new Error(`Quorum counts total ${counted}, expected ${packet.quorum.total}`);
  }
}

function decision(packet) {
  if (packet.quorum.approved >= packet.quorum.threshold) return 'ESCALATE';
  return 'HOLD';
}

function list(items = []) {
  if (!items.length) return '- none';
  return items.map((item) => `- ${item}`).join('\n');
}

function evidence(items = []) {
  if (!items.length) return '- none';
  return items.map((item) => `- [${item.label}](${item.url})`).join('\n');
}

function renderBrief(packet) {
  const vote = packet.quorum;
  return `# QuillCode Build Brief: ${packet.idea.title}

Status: ${decision(packet)}
Packet: ${packet.id}
Repo: ${packet.repo}
Steward: ${packet.steward}

## Source Signal
${packet.sourceSignal ?? 'Not provided.'}

## Vote
Approved: ${vote.approved}/${vote.total}
Rejected: ${vote.rejected}/${vote.total}
Abstained: ${vote.abstained}/${vote.total}
Threshold: ${vote.threshold}/${vote.total}

## Original Idea
${packet.idea.summary}

## Why It Is New
${packet.idea.whyNew}

## Immunity
Status: ${packet.immunity.status}
Level: ${packet.immunity.level}

${list(packet.immunity.findings)}

## Proposed Branch
\`${packet.implementation.branch}\`

## Files
${list(packet.implementation.files)}

## Steps
${list(packet.implementation.steps)}

## Tests
${list(packet.implementation.tests)}

## Receipt
Storage: ${packet.receipt?.storage ?? 'none'}
Status: ${packet.receipt?.status ?? 'planned'}
Blob ID: ${packet.receipt?.blobId || 'not stored yet'}
URL: ${packet.receipt?.url || 'not stored yet'}

## Evidence
${evidence(packet.evidence)}

## Approval Required
${list(packet.approvalRequired)}
`;
}

const args = process.argv.slice(2);
const input = args[0];
if (!input) {
  usage();
  process.exit(1);
}
const outIndex = args.indexOf('--out');
const outPath = outIndex >= 0 ? args[outIndex + 1] : null;

try {
  const packet = JSON.parse(await readFile(input, 'utf8'));
  assertPacket(packet);
  const brief = renderBrief(packet);
  if (outPath) {
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, brief, 'utf8');
    console.log(`QuillCode brief written: ${outPath}`);
  } else {
    console.log(brief);
  }
} catch (error) {
  console.error(`QuillCode failed: ${error.message}`);
  process.exit(1);
}

