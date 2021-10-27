import { allNFTsOf } from '@features/nft'

export default async function handler(req, res) {
  const { address } = req.query

  const responseData = await allNFTsOf(address).catch((e) => res.status(400).json(e.message))
  res.status(200).json(responseData)
}
