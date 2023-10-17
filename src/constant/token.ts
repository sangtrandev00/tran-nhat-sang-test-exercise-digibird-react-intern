
// Change Bearer Token here to use application
// export const BEARER_TOKEN =  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Rlc3QtcG9zLmRpZ2liaXJkLmlvL2FwaS92MS9mcm9udC9zaWduLXVwLXphbG8iLCJpYXQiOjE2OTc1MjgyNzEsImV4cCI6MTY5NzU1MDE3MSwibmJmIjoxNjk3NTI4MjcxLCJqdGkiOiJIUHFDalJiZEhxbU9VVXZaIiwic3ViIjoiMjI4MiIsInBydiI6IjFkMGEwMjBhY2Y1YzRiNmM0OTc5ODlkZjFhYmYwZmJkNGU4YzhkNjMifQ.PVBZq5908m_fb24hZXZRMIUjRskOuCMF1Wa-5k8BKBA';
export const BEARER_TOKEN =  JSON.parse(localStorage.getItem('token') as string)?.token || "";

console.log("BEARER_TOKEN: ", BEARER_TOKEN)


