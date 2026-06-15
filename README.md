# DreamNet QuillCode

QuillCode is the DreamNet build-packet compiler for agent steward work.

It sits between idea discovery and implementation. A partner repo steward can scan new protocol alpha, draft an original idea, gather quorum approval, attach immunity/safety findings, and compile the result into a branch-ready implementation packet.

## Why It Exists

Agent stewards should not spam operators with every new SDK release, Discord hint, or half-baked idea. QuillCode gives them a disciplined path:

```text
Partner Alpha
  -> Steward Idea
  -> 31-Agent Quorum
  -> Immunity/Safety Review
  -> QuillCode Packet
  -> Branch-Ready Build Brief
```

## Core Rule

A QuillCode packet is not allowed to escalate unless the review quorum reaches at least 22 approvals out of 31 reviewers.

## What QuillCode Does

- validates a steward proposal packet,
- checks quorum approval threshold,
- carries immunity/safety notes,
- records evidence links,
- emits a human-readable build brief,
- proposes the smallest safe next branch.

## What It Does Not Do

- does not deploy,
- does not sign transactions,
- does not spend funds,
- does not post publicly,
- does not mutate production systems,
- does not claim paid Immunity or external CodeQuill attestations unless real receipts exist.

## Quick Start

```bash
npm test
node src/quillcode.mjs examples/ens-agent-text-records.quillcode.json --out out/ens-brief.md
```

## Public Role

This repo is public because the packet structure is part of DreamNet's external trust story: agent ideas become actionable only after evidence, quorum, and safety review.
