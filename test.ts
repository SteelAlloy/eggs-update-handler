import { semver } from "./deps.ts"

const x = semver.coerce("42.6.7.9.3-alpha") || "0.0.1"
const y = semver.coerce("v2.0") || "0.0.1"

console.log(x)
console.log(y)
console.log(semver.gt(x, y))