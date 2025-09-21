use aiken/collection/list
use cardano/transaction.{Transaction, OutputReference}

// NFT Gift Card validator for Cardano
// This contract allows someone to lock ADA + mint NFT that can only be redeemed by a specific recipient

// Enhanced datum for NFT gift cards
pub type GiftCardDatum {
  recipient: ByteArray,        // PubKeyHash of the recipient
  nft_policy_id: ByteArray,    // Policy ID of the minted NFT
  nft_name: ByteArray,         // Name/identifier of the NFT
  ada_amount: Int,             // Amount of ADA locked
  message: ByteArray,          // Optional message from sender
  created_at: Int,             // Timestamp of creation
}

// Simple redeemer - no data needed as we check transaction signatories  
pub type GiftCardRedeemer = Void

// The main validator function
validator gift_card {
  spend(datum: Option<GiftCardDatum>, _redeemer: GiftCardRedeemer, _utxo: OutputReference, self: Transaction) {
    when datum is {
      None -> False
      Some(gift_datum) -> {
        // Check if the transaction is signed by the recipient
        let Transaction { extra_signatories, .. } = self
        list.has(extra_signatories, gift_datum.recipient)
      }
    }
  }
}

// Minting policy for NFT gift cards
validator nft_policy {
  mint(_redeemer: Void, _policy_id: ByteArray, self: Transaction) {
    // Simple minting policy - could be enhanced with time locks or other conditions
    True
  }
}
