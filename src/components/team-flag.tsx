import Image from "next/image";
import type { Team } from "@/lib/tournament";

const flagCodes: Record<string, string> = {
  ALG: "dz", ARG: "ar", AUS: "au", AUT: "at", BEL: "be", BIH: "ba",
  BRA: "br", CAN: "ca", CIV: "ci", COD: "cd", COL: "co", CPV: "cv",
  CRO: "hr", CUW: "cw", CZE: "cz", ECU: "ec", EGY: "eg", ENG: "gb-eng",
  ESP: "es", FRA: "fr", GER: "de", GHA: "gh", HAI: "ht", IRN: "ir",
  IRQ: "iq", JOR: "jo", JPN: "jp", KOR: "kr", KSA: "sa", MAR: "ma",
  MEX: "mx", NED: "nl", NOR: "no", NZL: "nz", PAN: "pa", PAR: "py",
  POR: "pt", QAT: "qa", RSA: "za", SCO: "gb-sct", SEN: "sn", SUI: "ch",
  SWE: "se", TUN: "tn", TUR: "tr", URU: "uy", USA: "us", UZB: "uz",
};

export function TeamFlag({ team, size = 28 }: { team: Team; size?: number }) {
  const code = flagCodes[team.code];
  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-sm bg-white/10 shadow-sm"
      style={{ width: size, height: Math.round(size * 0.67) }}
    >
      <Image
        src={`https://flagcdn.com/w80/${code}.png`}
        alt={`${team.name} flag`}
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </span>
  );
}
