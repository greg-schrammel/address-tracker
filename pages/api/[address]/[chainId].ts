import { balanceOf } from '@features/wallet'

export default async function handler(req, res) {
  const { address, chainId } = req.query

  const responseData = await balanceOf(address, chainId).catch((e) =>
    res.status(400).json(e.message),
  )
  res.status(200).json(responseData)
}
