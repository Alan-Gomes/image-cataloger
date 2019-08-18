import path from 'path';

export const BASE_DIR = process.env.CTLG_BASE_DIR || path.join(__dirname, '..');

export const RESOURCES_DIR = path.join(BASE_DIR, 'resources');
