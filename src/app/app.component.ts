import { Component, inject } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import { CalculatorService, EstadoCalculo } from './services/calculator.service';
import { HistoryService, EntradaHistorico } from './services/history.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('painelHistorico', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '280ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '220ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 0, transform: 'translateY(20px)' })
        ),
      ]),
    ]),
    trigger('fadeOverlay', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('280ms ease', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('220ms ease', style({ opacity: 0 })),
      ]),
    ]),
    trigger('animacaoDisplay', [
      transition('* => *', [
        style({ opacity: 0.5, transform: 'translateY(-6px)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class AppComponent {
  private calculadora = inject(CalculatorService);
  private historico = inject(HistoryService);

  displayAtual = '0';
  expressao = '';
  exibindoResultado = false;
  historicoAberto = false;
  temaClaro = false;
  private errorResetTimer: ReturnType<typeof setTimeout> | null = null;

  get listaHistorico(): EntradaHistorico[] {
    return this.historico.obterHistorico();
  }

  executar(tecla: string): void {
    if (this.errorResetTimer !== null) {
      clearTimeout(this.errorResetTimer);
      this.errorResetTimer = null;
    }

    let estado: EstadoCalculo;

    switch (tecla) {
      case 'C':
        estado = this.calculadora.limpar();
        this.exibindoResultado = false;
        this.atualizarDisplay(estado);
        break;

      case 'backspace':
        estado = this.calculadora.apagarUltimo();
        this.atualizarDisplay(estado);
        break;

      case '%':
        estado = this.calculadora.calcularPorcentagem();
        this.exibindoResultado = false;
        this.atualizarDisplay(estado);
        break;

      case '+':
      case '-':
      case '*':
      case '/':
        estado = this.calculadora.adicionarOperador(tecla);
        this.exibindoResultado = false;
        this.atualizarDisplay(estado);
        break;

      case '=': {
        const resultado = this.calculadora.calcular();
        this.atualizarDisplay(resultado.estado);

        if (resultado.erro) {
          this.displayAtual = 'Erro';
          this.exibindoResultado = false;
          this.errorResetTimer = setTimeout(() => {
            const limpo = this.calculadora.limpar();
            this.atualizarDisplay(limpo);
            this.errorResetTimer = null;
          }, 750);
        } else if (
          resultado.expressaoCompleta !== null &&
          resultado.resultado !== null
        ) {
          this.exibindoResultado = true;
          this.historico.adicionarEntrada(
            resultado.expressaoCompleta,
            resultado.resultado
          );
        }
        break;
      }

      case '.':
        estado = this.calculadora.adicionarDecimal();
        this.atualizarDisplay(estado);
        break;

      default:
        if (/^\d$/.test(tecla)) {
          estado = this.calculadora.adicionarNumero(tecla);
          this.exibindoResultado = false;
          this.atualizarDisplay(estado);
        }
    }
  }

  alternarTema(): void {
    this.temaClaro = !this.temaClaro;
  }

  alternarHistorico(): void {
    this.historicoAberto = !this.historicoAberto;
  }

  limparHistorico(): void {
    this.historico.limparHistorico();
  }

  formatarResultado(resultado: number): string {
    if (Number.isInteger(resultado)) return resultado.toString();
    return parseFloat(resultado.toFixed(10)).toString();
  }

  private atualizarDisplay(estado: EstadoCalculo): void {
    this.displayAtual = estado.displayAtual;
    this.expressao = estado.expressao;
  }
}
