/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Flag {
  Carry = 0x0001,
  Parity = 0x0004,
  AuxiliaryCarry = 0x0010,
  Zero = 0x0040,
  Sign = 0x0080,
  Trap = 0x0100,
  Interrupt = 0x0200,
  Direction = 0x0400,
  Overflow = 0x0800,
}

export interface Registers {
  ax: number;
  bx: number;
  cx: number;
  dx: number;
  si: number;
  di: number;
  bp: number;
  sp: number;
  ip: number;
  flags: number;
  cs: number;
  ds: number;
  es: number;
  ss: number;
}

export interface EmulatorState {
  registers: Registers;
  memory: Uint8Array;
  isHalted: boolean;
  instructions: string[];
  currentLine: number;
}

export const INITIAL_REGISTERS: Registers = {
  ax: 0, bx: 0, cx: 0, dx: 0,
  si: 0, di: 0, bp: 0, sp: 0xFFFE,
  ip: 0, flags: 0,
  cs: 0x0700, ds: 0x0700, es: 0x0700, ss: 0x0700
};

export const MEMORY_SIZE = 1024 * 1024; // 1MB

export class Emulator {
  state: EmulatorState;

  constructor() {
    this.state = {
      registers: { ...INITIAL_REGISTERS },
      memory: new Uint8Array(MEMORY_SIZE),
      isHalted: false,
      instructions: [],
      currentLine: -1
    };
  }

  reset() {
    this.state.registers = { ...INITIAL_REGISTERS };
    this.state.memory.fill(0);
    this.state.isHalted = false;
    this.state.currentLine = -1;
  }

  // Simplified instruction execution for demonstration
  // Real 8086 emulation is complex, we'll implement a subset
  step() {
    if (this.state.isHalted || this.state.currentLine >= this.state.instructions.length - 1) {
      this.state.isHalted = true;
      return;
    }

    this.state.currentLine++;
    const instruction = this.state.instructions[this.state.currentLine].trim().toLowerCase();
    if (!instruction || instruction.startsWith(';')) return;

    this.execute(instruction);
  }

  private execute(line: string) {
    const parts = line.split(/[\s,]+/).filter(p => p);
    const op = parts[0];
    const dest = parts[1];
    const src = parts[2];

    switch (op) {
      case 'mov':
        this.setVal(dest, this.getVal(src));
        break;
      case 'add':
        this.setVal(dest, this.getVal(dest) + this.getVal(src));
        break;
      case 'sub':
        this.setVal(dest, this.getVal(dest) - this.getVal(src));
        break;
      case 'inc':
        this.setVal(dest, this.getVal(dest) + 1);
        break;
      case 'dec':
        this.setVal(dest, this.getVal(dest) - 1);
        break;
      case 'hlt':
        this.state.isHalted = true;
        break;
    }
  }

  private getVal(ref: string): number {
    if (!ref) return 0;
    // Hex check
    if (ref.endsWith('h')) return parseInt(ref.slice(0, -1), 16);
    // Decimal check
    if (/^\d+$/.test(ref)) return parseInt(ref, 10);
    // Register check
    if (ref in this.state.registers) return (this.state.registers as any)[ref];
    
    // Sub-registers (AL, AH, etc)
    if (ref === 'al') return this.state.registers.ax & 0xFF;
    if (ref === 'ah') return (this.state.registers.ax >> 8) & 0xFF;
    if (ref === 'bl') return this.state.registers.bx & 0xFF;
    if (ref === 'bh') return (this.state.registers.bx >> 8) & 0xFF;
    if (ref === 'cl') return this.state.registers.cx & 0xFF;
    if (ref === 'ch') return (this.state.registers.cx >> 8) & 0xFF;
    if (ref === 'dl') return this.state.registers.dx & 0xFF;
    if (ref === 'dh') return (this.state.registers.dx >> 8) & 0xFF;

    return 0;
  }

  private setVal(ref: string, val: number) {
    val = val & 0xFFFF; // 16-bit limit
    if (ref in this.state.registers) {
      (this.state.registers as any)[ref] = val;
    } else if (ref === 'al') {
      this.state.registers.ax = (this.state.registers.ax & 0xFF00) | (val & 0xFF);
    } else if (ref === 'ah') {
      this.state.registers.ax = (this.state.registers.ax & 0x00FF) | ((val & 0xFF) << 8);
    } else if (ref === 'bl') {
      this.state.registers.bx = (this.state.registers.bx & 0xFF00) | (val & 0xFF);
    } else if (ref === 'bh') {
      this.state.registers.bx = (this.state.registers.bx & 0x00FF) | ((val & 0xFF) << 8);
    } else if (ref === 'cl') {
      this.state.registers.cx = (this.state.registers.cx & 0xFF00) | (val & 0xFF);
    } else if (ref === 'ch') {
      this.state.registers.cx = (this.state.registers.cx & 0x00FF) | ((val & 0xFF) << 8);
    } else if (ref === 'dl') {
      this.state.registers.dx = (this.state.registers.dx & 0xFF00) | (val & 0xFF);
    } else if (ref === 'dh') {
      this.state.registers.dx = (this.state.registers.dx & 0x00FF) | ((val & 0xFF) << 8);
    }
  }
}
