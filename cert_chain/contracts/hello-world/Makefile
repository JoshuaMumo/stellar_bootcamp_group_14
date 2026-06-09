-include ../../.env

all: test

test: build
	cargo test

debug: build
	RUST_BACKTRACE=full cargo test

t: test
	RUST_BACKTRACE=1 cargo test -- --nocapture

build:
	stellar contract build
	@ls -l ../../target/wasm32v1-none/release/*.wasm

fmt:
	cargo fmt --all

clean:
	cargo clean

# Deploy Pipeline 

upload: build
	@echo "📦 Uploading CertChain contract..."
	@stellar contract install \
	  --network  ${TESTNET} \
	  --source   ${SOURCE_TESTNET} \
	  --wasm ../../target/wasm32v1-none/release/hello_world.wasm > upload.log 2>&1 || (cat upload.log && exit 1)
	@grep -oE "[a-f0-9]{64}" upload.log | tail -n 1 > wasm_hash.txt
	@echo "✅ Wasm hash saved to wasm_hash.txt"
	@cat wasm_hash.txt

deploy: upload
	@echo "🚀 Deploying CertChain to testnet..."
	@stellar contract deploy \
	  --wasm-hash  $$(cat wasm_hash.txt) \
	  --network    ${TESTNET} \
	  --source-account ${SOURCE_TESTNET} \
	  -- \
	    --admin ${ADMIN} > deploy.log 2>&1 || (cat deploy.log && exit 1)
	@grep -oE "C[A-Z0-9]{55}" deploy.log | tail -n 1 > contract_address.txt
	@echo "✅ Contract address saved to contract_address.txt"
	@cat contract_address.txt

#  Admin Functions 

init:
	stellar contract invoke \
	  --id     $$(cat contract_address.txt) \
	  --source-account ${SOURCE_TESTNET} \
	  --network ${TESTNET} \
	  --inclusion-fee   ${FEE} \
	  -- \
	  init \
	    --admin ${ADMIN}

add-issuer:
	stellar contract invoke \
	  --id     $$(cat contract_address.txt) \
	  --source-account ${SOURCE_TESTNET} \
	  --network ${TESTNET} \
	  --inclusion-fee    ${FEE} \
	  -- add_issuer \
	    --admin  ${ADMIN} \
	    --issuer ${ISSUER}

remove-issuer:
	stellar contract invoke \
	  --id     $$(cat contract_address.txt) \
	  --source-account ${SOURCE_TESTNET} \
	  --network ${TESTNET} \
	  --inclusion-fee    ${FEE} \
	  -- remove_issuer \
	    --admin  ${ADMIN} \
	    --issuer ${ISSUER}

#  Certificate Functions 

issue:
	stellar contract invoke \
	  --id     $$(cat contract_address.txt) \
	  --source-account ${SOURCE_TESTNET} \
	  --network ${TESTNET} \
	  --inclusion-fee    ${FEE} \
	  -- issue_cert \
	    --issuer     ${ISSUER} \
	    --hash       ${CERT_HASH} \
	    --student_id ${STUDENT_ID} \
	    --degree     ${DEGREE} \
	    --year       ${YEAR}

verify:
	stellar contract invoke \
	  --id     $$(cat contract_address.txt) \
	  --source-account ${SOURCE_TESTNET} \
	  --network ${TESTNET} \
	  --inclusion-fee    ${FEE} \
	  -- verify \
	    --hash ${CERT_HASH}

revoke:
	stellar contract invoke \
	  --id     $$(cat contract_address.txt) \
	  --source-account ${SOURCE_TESTNET} \
	  --network ${TESTNET} \
	  --inclusion-fee    ${FEE} \
	  -- revoke_cert \
	    --issuer ${ISSUER} \
	    --hash   ${CERT_HASH}

#  Helpers 

# Saves address to README automatically so the team always has the latest
save-address:
	@echo "📝 Updating contract address in README..."
	@sed -i "s/CONTRACT_ADDRESS=.*/CONTRACT_ADDRESS=$$(cat contract_address.txt)/" ../.env
	@echo "✅ .env updated — commit and push so the team picks it up"

logs:
	@echo "=== upload.log ===" && cat upload.log 2>/dev/null || echo "No upload log"
	@echo "=== deploy.log ===" && cat deploy.log 2>/dev/null || echo "No deploy log"

.PHONY: all test debug t build fmt clean upload deploy \
        init add-issuer remove-issuer issue verify revoke \
        save-address logs