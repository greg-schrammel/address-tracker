import { allBalancesOf } from '@features/wallet'

export default async function handler(req, res) {
  const { address } = req.query

  const responseData = await allBalancesOf(address).catch((e) => res.status(400).json(e.message))
  res.status(200).json(responseData)
}
