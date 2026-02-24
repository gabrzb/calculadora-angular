import { Injectable } from '@angular/core';

export interface EstadoCalculo {
  displayAtual: string;
  expressao: string;
}

export interface ResultadoCalculo {
  estado: EstadoCalculo;
  expressaoCompleta: string | null;
  resultado: number | null;
  erro: boolean;
}

@Injectable({ providedIn: 'root' })
export class CalculatorService {
  private valorDisplay = '';
  private expressao = '';
  private primeiroValor: number | null = null;
  private operador: string | null = null;
  private aguardandoSegundoValor = false;

  obterEstado(): EstadoCalculo {
    return {
      displayAtual: this.valorDisplay || '0',
      expressao: this.expressao,
    };
  }

  adicionarNumero(valor: string): EstadoCalculo {
    if (this.aguardandoSegundoValor) {
      if (this.operador === null) {
        this.expressao = '';
        this.primeiroValor = null;
      }
      this.valorDisplay = valor;
      this.aguardandoSegundoValor = false;
    } else {
      this.valorDisplay =
        this.valorDisplay === '0' || this.valorDisplay === ''
          ? valor
          : this.valorDisplay + valor;
    }
    return this.obterEstado();
  }

  adicionarDecimal(): EstadoCalculo {
    if (this.aguardandoSegundoValor) {
      if (this.operador === null) {
        this.expressao = '';
        this.primeiroValor = null;
      }
      this.valorDisplay = '0.';
      this.aguardandoSegundoValor = false;
      return this.obterEstado();
    }
    if (!this.valorDisplay.includes('.') && this.valorDisplay !== '') {
      this.valorDisplay += '.';
    } else if (this.valorDisplay === '') {
      this.valorDisplay = '0.';
    }
    return this.obterEstado();
  }

  adicionarOperador(op: string): EstadoCalculo {
    const simbolo = this.simboloOperador(op);

    if (!this.aguardandoSegundoValor) {
      if (this.primeiroValor === null || this.operador === null) {
        this.primeiroValor = parseFloat(this.valorDisplay || '0');
        this.expressao = (this.valorDisplay || '0') + simbolo;
      } else {
        const resultado = this.executarOperacao();
        if (resultado !== null) {
          this.valorDisplay = this.formatarNumero(resultado);
          this.primeiroValor = resultado;
          this.expressao = this.formatarNumero(resultado) + simbolo;
        }
      }
    } else {
      this.expressao = this.formatarNumero(this.primeiroValor ?? 0) + simbolo;
    }

    this.operador = op;
    this.aguardandoSegundoValor = true;
    return this.obterEstado();
  }

  calcular(): ResultadoCalculo {
    const segundoValor = parseFloat(this.valorDisplay);

    if (
      isNaN(segundoValor) ||
      this.primeiroValor === null ||
      this.operador === null
    ) {
      return {
        estado: this.obterEstado(),
        expressaoCompleta: null,
        resultado: null,
        erro: false,
      };
    }

    const simbolo = this.simboloOperador(this.operador);
    const expressaoCompleta = `${this.formatarNumero(this.primeiroValor)}${simbolo}${this.formatarNumero(segundoValor)}`;
    const resultado = this.executarOperacao();

    if (resultado === null) {
      this.valorDisplay = 'Erro';
      this.expressao = '';
      this.primeiroValor = null;
      this.operador = null;
      this.aguardandoSegundoValor = false;

      return {
        estado: { displayAtual: 'Erro', expressao: '' },
        expressaoCompleta: null,
        resultado: null,
        erro: true,
      };
    }

    this.expressao = expressaoCompleta;
    this.valorDisplay = this.formatarNumero(resultado);
    this.primeiroValor = resultado;
    this.operador = null;
    this.aguardandoSegundoValor = true;

    return {
      estado: this.obterEstado(),
      expressaoCompleta,
      resultado,
      erro: false,
    };
  }

  apagarUltimo(): EstadoCalculo {
    if (this.valorDisplay.length > 0 && !this.aguardandoSegundoValor) {
      this.valorDisplay = this.valorDisplay.slice(0, -1);
    }
    return this.obterEstado();
  }

  calcularPorcentagem(): EstadoCalculo {
    const valor = parseFloat(this.valorDisplay);
    if (!isNaN(valor)) {
      this.valorDisplay = this.formatarNumero(valor / 100);
    }
    return this.obterEstado();
  }

  limpar(): EstadoCalculo {
    this.valorDisplay = '';
    this.expressao = '';
    this.primeiroValor = null;
    this.operador = null;
    this.aguardandoSegundoValor = false;
    return this.obterEstado();
  }

  private executarOperacao(): number | null {
    const segundoValor = parseFloat(this.valorDisplay);
    if (this.primeiroValor === null || this.operador === null) return null;
    if (isNaN(segundoValor)) return null;

    switch (this.operador) {
      case '+': return this.primeiroValor + segundoValor;
      case '-': return this.primeiroValor - segundoValor;
      case '*': return this.primeiroValor * segundoValor;
      case '/': return segundoValor === 0 ? null : this.primeiroValor / segundoValor;
      default: return null;
    }
  }

  simboloOperador(op: string): string {
    const mapa: Record<string, string> = {
      '+': '+',
      '-': '\u2212',
      '*': '\u00D7',
      '/': '\u00F7',
    };
    return mapa[op] ?? op;
  }

  private formatarNumero(num: number): string {
    if (Number.isInteger(num)) return num.toString();
    return parseFloat(num.toFixed(10)).toString();
  }
}
