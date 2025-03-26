import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  template: `
    <div class="calculadora-container">
      <div class="display" aria-live="polite">
        {{ display || '0' }}
      </div>

      <div class="teclado">
        <button class="botao operador" (click)="limparDisplay()" aria-label="Limpar">C</button>
        <button class="botao operador" (click)="adicionarOperador('/')" aria-label="Dividir">/</button>
        <button class="botao operador" (click)="adicionarOperador('*')" aria-label="Multiplicar">×</button>
        <button class="botao operador" (click)="adicionarOperador('-')" aria-label="Subtrair">−</button>

        <button class="botao" (click)="adicionarNumero('7')" aria-label="7">7</button>
        <button class="botao" (click)="adicionarNumero('8')" aria-label="8">8</button>
        <button class="botao" (click)="adicionarNumero('9')" aria-label="9">9</button>
        <button class="botao operador" (click)="adicionarOperador('+')" aria-label="Somar">+</button>

        <button class="botao" (click)="adicionarNumero('4')" aria-label="4">4</button>
        <button class="botao" (click)="adicionarNumero('5')" aria-label="5">5</button>
        <button class="botao" (click)="adicionarNumero('6')" aria-label="6">6</button>
        <button class="botao igual" (click)="calcular()" aria-label="Calcular">=</button>

        <button class="botao" (click)="adicionarNumero('1')" aria-label="1">1</button>
        <button class="botao" (click)="adicionarNumero('2')" aria-label="2">2</button>
        <button class="botao" (click)="adicionarNumero('3')" aria-label="3">3</button>
        
        <button class="botao zero" (click)="adicionarNumero('0')" aria-label="0">0</button>
        <button class="botao" (click)="adicionarDecimal()" aria-label="Ponto decimal">.</button>
      </div>
    </div> 
  `,
  styles: [],
})
export class AppComponent {
  // Variáveis de estado da calculadora
  display: string = '';
  primeiroValor: number | null = null;
  operador: string | null = null;
  aguardandoSegundoValor: boolean = false;

  adicionarNumero(valor: string): void {
    if (this.aguardandoSegundoValor) {
      this.display = valor;
      this.aguardandoSegundoValor = false;
    } else {
      // Concatena números ao valor atual caso não espere o segundo número
      this.display = this.display === '0' ? valor : this.display + valor;
    }
  }

  adicionarDecimal(): void {
    if (this.aguardandoSegundoValor) {
      this.display = '0.';
      this.aguardandoSegundoValor = false;
      return;
    }

    // Adiciona o ponto apenas se não existir
    if (!this.display.includes('.') && this.display !== '') {
      this.display += '.';
    } else if (this.display === '') {
      this.display = '0.';
    }

  }

  adicionarOperador(operador: string): void {
    if (!this.aguardandoSegundoValor) {

      if (this.primeiroValor === null) {
        this.primeiroValor = parseFloat(this.display);
      } else if (this.operador) {
        this.calcular();
      }
      
      this.operador = operador;
      this.aguardandoSegundoValor = true;

    } else {
      this.operador = operador;
    }
  }

  calcular(): void {
    const segundoValor = parseFloat(this.display);
    let resultado: number;

    // Verifica se o segundo valor é um número válido
    if (isNaN(segundoValor) ||  (this.primeiroValor === null || this.operador === null) ){
      this.mensagemErro();
      return;
    }

    // Realiza a operação matemática solicitada
    switch (this.operador) {
      case '+': resultado = this.primeiroValor + segundoValor; break;
      case '-': resultado = this.primeiroValor - segundoValor; break;
      case '*': resultado = this.primeiroValor * segundoValor; break;
      case '/': 
        // Evita a divisão por zero
        if (segundoValor === 0) {
          this.mensagemErro();
          return;
        }

        resultado = this.primeiroValor / segundoValor;
        break;
      default: resultado = segundoValor;
    }

    // Atualiza a tela com o  resultado e reseta o estado
    this.display = resultado.toString();
    this.primeiroValor = resultado;
    this.operador = null;
    this.aguardandoSegundoValor = true;
  }
  
  // Método para exibir a mensagem de erro por um tempo
  mensagemErro(): void {
    this.display = 'Erro';
    setTimeout(() => { this.limparDisplay(); }, 750);
  }

  // Limpa o display e reseta os estados
  limparDisplay(): void {
    this.display = '';
    this.primeiroValor = null;
    this.operador = null;
    this.aguardandoSegundoValor = false;
  }

}
