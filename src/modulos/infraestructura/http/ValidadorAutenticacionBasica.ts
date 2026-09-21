import { timingSafeEqual } from "node:crypto";

export class ValidadorAutenticacionBasica {
  constructor(
    private readonly usuario: string,
    private readonly contrasena: string,
  ) {}

  esValida(encabezado: string | null): boolean {
    if (!encabezado?.startsWith("Basic ")) return false;
    let decoded: string;
    try {
      decoded = Buffer.from(encabezado.slice(6), "base64").toString("utf8");
    } catch {
      return false;
    }
    const separator = decoded.indexOf(":");
    if (separator < 0) return false;
    return (
      this.esIgual(decoded.slice(0, separator), this.usuario) &&
      this.esIgual(decoded.slice(separator + 1), this.contrasena)
    );
  }

  private esIgual(actual: string, esperado: string): boolean {
    const actualBuffer = Buffer.from(actual);
    const expectedBuffer = Buffer.from(esperado);
    if (actualBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(actualBuffer, expectedBuffer);
  }
}
