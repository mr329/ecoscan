
import { BinColor, BinRule } from './types';

export const BIN_RULES: Record<BinColor, BinRule> = {
  [BinColor.BROWN]: {
    color: BinColor.BROWN,
    label: 'Brown Bin',
    description: 'Dry Waste',
    prohibited: ['Liquid', 'Food'],
    examples: [
      'Plastic bags & soft plastics (clean)',
      'Empty coffee cups',
      'Stationery items',
      'Paper towels (damp is fine)',
      'Textiles & kitchen cloths',
      'Empty drink cartons',
      'Clean food packaging & cutlery'
    ],
    bgColor: 'bg-[#5D4037]',
    textColor: 'text-white',
    borderColor: 'border-[#4E342E]',
    accentColor: 'text-[#D7CCC8]'
  },
  [BinColor.GREEN]: {
    color: BinColor.GREEN,
    label: 'Green Bin',
    description: 'Food Waste',
    prohibited: [
      'Plastic bags',
      'Paper towels',
      'Packaging & cutlery',
      'Glass or plastic bottles',
      'Large bones or shells',
      'Flowers',
      'Cardboard',
      'Metals'
    ],
    examples: ['Food waste', 'Coffee grounds', 'Tea bags'],
    bgColor: 'bg-[#2E7D32]',
    textColor: 'text-white',
    borderColor: 'border-[#1B5E20]',
    accentColor: 'text-[#C8E6C9]'
  },
  [BinColor.YELLOW]: {
    color: BinColor.YELLOW,
    label: 'Yellow Bin',
    description: 'Mixed Recycling',
    prohibited: [
      'Liquid',
      'Paper towels & serviettes',
      'Drink cartons',
      'Compostable packaging',
      'Food'
    ],
    examples: [
      'Empty plastic bottles (no lids)',
      'Empty glass bottles (no lids)',
      'Empty aluminum & steel cans',
      'Rinsed plastic takeaway containers'
    ],
    bgColor: 'bg-[#FBC02D]',
    textColor: 'text-[#263238]',
    borderColor: 'border-[#F9A825]',
    accentColor: 'text-[#FFF9C4]'
  },
  [BinColor.BLUE]: {
    color: BinColor.BLUE,
    label: 'Blue Bin',
    description: 'Paper & Cardboard',
    prohibited: [
      'Food or liquid',
      'Paper hand towels',
      'Soiled cardboard',
      'Waxed boxes',
      'Packaging'
    ],
    examples: [
      'Non-confidential documents',
      'Envelopes',
      'Newspapers & magazines',
      'Small cardboard boxes'
    ],
    bgColor: 'bg-[#1565C0]',
    textColor: 'text-white',
    borderColor: 'border-[#0D47A1]',
    accentColor: 'text-[#BBDEFB]'
  },
  [BinColor.UNKNOWN]: {
    color: BinColor.UNKNOWN,
    label: 'General Waste',
    description: 'Non-recyclable',
    prohibited: [],
    examples: ['Diapers', 'Sanitary products', 'Broken ceramics'],
    bgColor: 'bg-[#455A64]',
    textColor: 'text-white',
    borderColor: 'border-[#263238]',
    accentColor: 'text-[#CFD8DC]'
  }
};

export const RECYCLING_FACTS = [
  "Recycling one aluminum can saves enough energy to run a TV for three hours!",
  "Glass can be recycled indefinitely without losing its quality or purity.",
  "Recycling a single glass bottle saves enough energy to light a 100-watt light bulb for four hours.",
  "Most plastic bottles take 450 years to decompose in a landfill.",
  "Recycling one ton of paper saves 17 trees and 7,000 gallons of water.",
  "Aluminum can be back on the shelf as a new can in as little as 60 days after recycling.",
  "The energy saved from recycling one plastic bottle can power a computer for 25 minutes."
];

export const RECYCLING_QUIZ = [
  {
    question: "Where do greasy pizza boxes go?",
    options: ["Blue Bin", "Brown Bin", "Green Bin"],
    answer: 1 // Brown Bin
  },
  {
    question: "Can you recycle plastic bottle lids in the Yellow Bin?",
    options: ["Yes", "No", "Only if they are blue"],
    answer: 1 // No (based on rules: empty bottles, no lids)
  },
  {
    question: "Where do empty drink cartons (Tetra Paks) go?",
    options: ["Yellow Bin", "Blue Bin", "Brown Bin"],
    answer: 2 // Brown Bin
  },
  {
    question: "Are paper towels recyclable in the Blue Bin?",
    options: ["Yes", "No", "Only if dry"],
    answer: 1 // No (they go in Brown)
  }
];
