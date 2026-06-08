# api/soroban.py
import os
import time
from stellar_sdk import Keypair, Network, TransactionBuilder
from stellar_sdk.soroban_server import SorobanServer
from stellar_sdk.soroban_rpc import TransactionStatus
from stellar_sdk import scval

def submit_hash_to_contract(document_hash: str, wallet_address: str) -> bool:
    """
    Invokes the Soroban smart contract to register the document hash.
    """
    secret_key = os.environ.get("STELLAR_SECRET_KEY")
    contract_id = os.environ.get("SOROBAN_CONTRACT_ID")
    
    if not secret_key or not contract_id:
        print("Missing Stellar environment variables.")
        return False

    admin_kp = Keypair.from_secret(secret_key)
    server = SorobanServer("https://soroban-testnet.stellar.org")
    network_passphrase = Network.TESTNET_NETWORK_PASSPHRASE

    try:
        # 1. Fetch source account details
        source_account = server.get_account(admin_kp.public_key)

        # 2. Build the invocation operation
        # Assuming the contract function is named 'issue_cert'
        args = [scval.to_string(document_hash),
                scval.to_address(wallet_address)
        ]
        
        tx = (
            TransactionBuilder(
                source_account=source_account,
                network_passphrase=network_passphrase,
                base_fee=100,
            )
            .append_invoke_contract_function_op(
                contract_id=contract_id,
                function_name="issue_cert",
                parameters=args,
            )
            .set_timeout(30)
            .build()
        )

        # 3. Simulate the transaction (Required for Soroban)
        simulated_tx = server.simulate_transaction(tx)
        if "error" in simulated_tx:
            print(f"Simulation failed: {simulated_tx['error']}")
            return False

        # 4. Assemble and sign
        assembled_tx = server.assemble_transaction(tx, simulated_tx)
        assembled_tx.sign(admin_kp)

        # 5. Submit to the network
        send_response = server.send_transaction(assembled_tx)
        if send_response.status != TransactionStatus.PENDING:
            return False

        # 6. Poll for confirmation
        tx_hash = send_response.hash
        for _ in range(10):
            time.sleep(3)
            tx_result = server.get_transaction(tx_hash)
            if tx_result.status == TransactionStatus.SUCCESS:
                return True
            elif tx_result.status == TransactionStatus.FAILED:
                return False

        return False

    except Exception as e:
        print(f"Blockchain execution error: {e}")
        return False