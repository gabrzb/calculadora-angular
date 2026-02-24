import { Injectable } from '@angular/core';

export interface EntradaHistorico {
  expressao: string;
  resultado: number;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly CHAVE_STORAGE = 'calculadora-historico';
  private historico: EntradaHistorico[] = [];

  constructor() {
    this.carregarDoStorage();
  }

  obterHistorico(): EntradaHistorico[] {
    return [...this.historico];
  }

  adicionarEntrada(expressao: string, resultado: number): void {
    this.historico.unshift({
      expressao,
      resultado,
      timestamp: Date.now(),
    });
    if (this.historico.length > 50) {
      this.historico = this.historico.slice(0, 50);
    }
    this.salvarNoStorage();
  }

  limparHistorico(): void {
    this.historico = [];
    this.salvarNoStorage();
  }

  private carregarDoStorage(): void {
    try {
      const dados = localStorage.getItem(this.CHAVE_STORAGE);
      if (dados) {
        this.historico = JSON.parse(dados);
      }
    } catch {
      this.historico = [];
    }
  }

  private salvarNoStorage(): void {
    try {
      localStorage.setItem(this.CHAVE_STORAGE, JSON.stringify(this.historico));
    } catch {
      // Storage indisponivel
    }
  }
}
