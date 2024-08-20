import path from 'path';
import prisma from '../prisma/prisma-client';
import { localGuild } from '../types/global-types';
import { readdirSync, statSync } from 'fs';

/**
 * Function to get commands or events
 */
export const getData = (type: 'commands' | 'events') => {
  const data = [];
  const dataFiles: string[] = [];
  const dataPath = path.resolve(__dirname + '../../../' + type);
  const dataDir = readdirSync(dataPath);

  dataDir.forEach((file) => {
    const filePath = path.resolve(dataPath, file);

    if (statSync(filePath).isDirectory()) {
      const subFiles = readdirSync(filePath);
      subFiles.forEach((subFile) => dataFiles.push(`${file}/${subFile}`));
    }

    if (statSync(filePath).isFile()) dataFiles.push(file);
  });

  for (const file of dataFiles) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dataItem = require(`../../${type}/${file}`);
    data.push(dataItem);
  }

  return data;
};

/**
 * Function to get guild data from database
 */
export const getGuildData = async () => {
  const guildData = await prisma.guild.findUnique({
    where: {
      guildId: localGuild.id,
    },
  });

  return guildData;
};

/**
 * Function representing capitalizing first letter
 */
export const capitalizeFirstLetter = (input: string): string => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

/**
 * Function to generate id for new tasks and concepts
 */
export const generateId = async () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const length = 6;

  const id = Array.from({ length }, () => {
    const random = Math.random();
    const characters = random < 0.5 ? letters : numbers;
    return characters.charAt(Math.floor(random * characters.length));
  }).join('');

  if (
    (await prisma.task.findUnique({ where: { id } })) ||
    (await prisma.concept.findUnique({ where: { id } }))
  ) {
    generateId();
  }

  return id;
};
