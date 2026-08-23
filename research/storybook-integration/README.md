# Storybook & A2UI Composer Integration Research

This directory contains research, specifications, and prototype proposals for utilizing Storybook as a source of truth for components within the A2UI ecosystem.

## Goal
To design and specify a seamless pipeline that bridges **Storybook (industry-standard component development)** with the **A2UI Composer & Runtimes**, enabling automatic component catalog synchronization, interactive visual builders, and a new high-level "Templates" layer for rapid agentic UI assembly.

## Contents
1. [Storybook Metadata & Extensibility Research](./research-storybook.md)  
   *Extracted mechanisms from Storybook (index.json, CLI, docgen) to act as a programmatic source of truth.*
2. [A2UI Composer Architecture Analysis](./research-composer.md)  
   *Current state of the A2UI Composer and direct integration opportunities.*
3. [Component-to-Catalog Sync Specification](./specification-catalog-sync.md)  
   *Proposed architecture for automatic catalog extraction, mapping low-level primitives and high-level templates.*
4. [Prototypes Proposal](./prototypes-proposal.md)  
   *A structured roadmap of 3 rapid prototypes to evaluate the integration E2E over the next few days.*
